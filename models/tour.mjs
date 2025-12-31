import db from "../config/db.mjs";
import { getDurationType } from "../utils/DurationType.mjs";
import { calculatePrice } from "../utils/priceCalculator.mjs";
// Create a new tour
export const createTour = async (tourData) => {
  const {
    title,
    duration,
    cityID,
    description,
    meetingPoint,
    gps_latitude,
    gps_longitude,
    guideID,
    photos,
    included,
    excluded,
    highlights,
    itinerary,
  } = tourData;

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // Get guide's pricing
    const [guide] = await conn.query(
      'SELECT price_halfDay, price_fullDay, price_extraHour FROM users WHERE userID = ? AND role = "guide"',
      [guideID]
    );

    if (!guide || guide.length === 0) {
      throw new Error("Guide not found");
    }

    const price = calculatePrice(duration, guide[0]);

    /*
    // Validate/Insert city
    let cityID;
    const [cityResult] = await conn.query(
      "SELECT cityID FROM cities WHERE name = ?",
      [city]
    );

    if (cityResult.length === 0) {
      const [newCity] = await conn.query(
        "INSERT INTO cities (name) VALUES (?)",
        [city]
      );
      cityID = newCity.insertId;
    } else {
      cityID = cityResult[0].cityID;
    }
    */

    // Insert tour
    const [result] = await conn.query(
      `INSERT INTO tours 
      (title, duration, cityID, description, meetingPoint, gps_latitude, gps_longitude, guideID)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        duration,
        cityID,
        description,
        meetingPoint,
        gps_latitude,
        gps_longitude,
        guideID,
      ]
    );

    const tourID = result.insertId;

    // Insert photos
    if (photos && photos.length > 0) {
      const photoValues = photos.map((photoURL) => [photoURL, tourID]);
      await conn.query("INSERT INTO tourphotos (photoURL, tourID) VALUES ?", [
        photoValues,
      ]);
    }

    // Insert included items
    if (included && included.length > 0) {
      const includedValues = included.map((item) => [tourID, item]);
      await conn.query("INSERT INTO tourincludeds (tourID, item) VALUES ?", [
        includedValues,
      ]);
    }

    // Insert excluded items
    if (excluded && excluded.length > 0) {
      const excludedValues = excluded.map((item) => [tourID, item]);
      await conn.query("INSERT INTO tourexcludeds (tourID, item) VALUES ?", [
        excludedValues,
      ]);
    }

    // Insert highlights
    if (highlights && highlights.length > 0) {
      const highlightValues = highlights.map((highlight) => [
        tourID,
        highlight,
      ]);
      await conn.query(
        "INSERT INTO tourhighlights (tourID, highlight) VALUES ?",
        [highlightValues]
      );
    }

    // Insert itinerary
    if (itinerary && itinerary.length > 0) {
      const itineraryValues = itinerary.map((step, index) => [
        tourID,
        index + 1,
        step.stepTime || null,
        step.details,
      ]);
      await conn.query(
        "INSERT INTO itineraries (tourID, stepOrder, stepTime, details) VALUES ?",
        [itineraryValues]
      );
    }

    await conn.commit();
    return { tourID, calculatedPrice: price };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

// Get top rated tours (for landing page)
export const getTopRatedTours = async (limit = 6) => {
  const [tours] = await db.query(
    `SELECT 
      t.*,
      u.firstName,
      u.lastName,
      u.photoURL as guidePhoto,
      u.price_halfDay,
      u.price_fullDay,
      u.price_extraHour,
      (SELECT photoURL FROM tourphotos WHERE tourID = t.tourID LIMIT 1) as primaryPhoto,
      COALESCE(AVG(r.rating), 0) as avgRating,
      COUNT(DISTINCT r.reviewID) as reviewCount,
      COUNT(DISTINCT res.reservationID) as bookingCount
    FROM tours t
    INNER JOIN users u ON t.guideID = u.userID
    LEFT JOIN reviews r ON t.tourID = r.tourID
    LEFT JOIN toreserve res ON t.tourID = res.tourID AND res.status = 'confirmed'
    WHERE u.role = 'guide'
    GROUP BY t.tourID
    HAVING avgRating > 0
    ORDER BY avgRating DESC, reviewCount DESC
    LIMIT ?`,
    [limit]
  );

  return tours.map((tour) => ({
    ...tour,
    calculatedPrice: calculatePrice(tour.duration, {
      price_halfDay: tour.price_halfDay,
      price_fullDay: tour.price_fullDay,
      price_extraHour: tour.price_extraHour,
    }),
    durationType: getDurationType(tour.duration),
  }));
};

// Advanced search with filters
export const searchTours = async (filters) => {
  const {
    city,
    maxPrice,
    durationType, // Array: ['half-day', 'one-day', 'multi-day']
    guideID,
    guideName,
    searchTerm,
    page = 1,
    limit = 10,
  } = filters;

  const offset = (filters.page - 1) * filters.limit;

  let params = [];

  // Build base query
  let query = `
    SELECT 
      t.*,
      u.firstName,
      u.lastName,
      u.photoURL as guidePhoto,
      u.price_halfDay,
      u.price_fullDay,
      u.price_extraHour,
      (SELECT photoURL FROM tourphotos WHERE tourID = t.tourID LIMIT 1) as primaryPhoto,
      COALESCE(AVG(r.rating), 0) as avgRating,
      COUNT(DISTINCT r.reviewID) as reviewCount
    FROM tours t
    INNER JOIN users u ON t.guideID = u.userID
    LEFT JOIN cities c ON t.cityID = c.cityID
    LEFT JOIN reviews r ON t.tourID = r.tourID
    WHERE u.role = 'guide'
  `;

  // City filter
  if (city) {
    query += ` AND c.name = ?`;
    params.push(city);
  }

  // Guide filter
  if (guideName) {
    query += ` AND (u.firstName LIKE ? OR u.lastName LIKE ?)`;
    params.push(`%${guideName}%`, `%${guideName}%`);
  }

  /*
  if (guideID) {
      query += ` AND t.guideID = ?`;
      params.push(guideID);
  }
  */

  // Search term filter
  if (searchTerm) {
    query += ` AND (t.title LIKE ? OR t.description LIKE ?)`;
    params.push(`%${searchTerm}%`, `%${searchTerm}%`);
  }

  // Duration type filter
  if (durationType && durationType.length > 0) {
    const durationConditions = [];

    if (durationType.includes("half-day")) {
      durationConditions.push("t.duration <= 4");
    }
    if (durationType.includes("one-day")) {
      durationConditions.push("(t.duration > 4 AND t.duration <= 8)");
    }
    if (durationType.includes("multi-day")) {
      durationConditions.push("t.duration > 8");
    }

    if (durationConditions.length > 0) {
      query += ` AND (${durationConditions.join(" OR ")})`;
    }
  }

  query += ` GROUP BY t.tourID`;

  // Get total count before price filter
  const countQuery = `SELECT COUNT(*) as total FROM (${query}) as countTable`;
  const [countResult] = await db.query(countQuery, params);
  let total = countResult[0].total;

  // Apply max price filter after grouping (needs to calculate price first)
  if (maxPrice) {
    query = `
      SELECT * FROM (
        ${query}
      ) as priced_tours
      WHERE CASE 
        WHEN duration <= 4 THEN price_halfDay
        WHEN duration <= 8 THEN price_fullDay
        ELSE price_fullDay + ((duration - 8) * price_extraHour)
      END <= ?
    `;
    params.push(maxPrice);

    // Recalculate total with price filter
    const [priceFilterCount] = await db.query(
      `SELECT COUNT(*) as total FROM (${query}) as finalCount`,
      params
    );
    total = priceFilterCount[0].total;
  }

  // Add ordering and pagination
  query += ` ORDER BY avgRating DESC, reviewCount DESC LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), offset);

  const [tours] = await db.query(query, params);

  return {
    tours: tours.map((tour) => ({
      ...tour,
      calculatedPrice: calculatePrice(tour.duration, {
        price_halfDay: tour.price_halfDay,
        price_fullDay: tour.price_fullDay,
        price_extraHour: tour.price_extraHour,
      }),
      durationType: getDurationType(tour.duration),
    })),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Get tour details by ID
export const getTourById = async (tourID) => {
  const [tours] = await db.query(
    `SELECT 
      t.*,
      u.firstName,
      u.lastName,
      u.email,
      u.photoURL as guidePhoto,
      u.biography,
      u.phoneNumber,
      u.price_halfDay,
      u.price_fullDay,
      u.price_extraHour,
      COALESCE(AVG(r.rating), 0) as avgRating,
      COUNT(DISTINCT r.reviewID) as reviewCount
    FROM tours t
    INNER JOIN users u ON t.guideID = u.userID
    LEFT JOIN reviews r ON t.tourID = r.tourID
    WHERE t.tourID = ?
    GROUP BY t.tourID`,
    [tourID]
  );

  if (tours.length === 0) return null;

  const tour = tours[0];

  // Calculate price
  tour.calculatedPrice = calculatePrice(tour.duration, {
    price_halfDay: tour.price_halfDay,
    price_fullDay: tour.price_fullDay,
    price_extraHour: tour.price_extraHour,
  });

  tour.durationType = getDurationType(tour.duration);

  // Get photos
  const [photos] = await db.query(
    "SELECT photoID, photoURL FROM tourphotos WHERE tourID = ? ORDER BY photoID",
    [tourID]
  );
  tour.photos = photos;

  // Get included items
  const [included] = await db.query(
    "SELECT includedID, item FROM tourincludeds WHERE tourID = ?",
    [tourID]
  );
  tour.included = included;

  // Get excluded items
  const [excluded] = await db.query(
    "SELECT excludedID, item FROM tourexcludeds WHERE tourID = ?",
    [tourID]
  );
  tour.excluded = excluded;

  // Get highlights
  const [highlights] = await db.query(
    "SELECT highlightID, highlight FROM tourhighlights WHERE tourID = ?",
    [tourID]
  );
  tour.highlights = highlights;

  // Get itinerary
  const [itinerary] = await db.query(
    "SELECT itineraryID, stepOrder, stepTime, details FROM itineraries WHERE tourID = ? ORDER BY stepOrder",
    [tourID]
  );
  tour.itinerary = itinerary;

  return tour;
};

// Get tour reviews with pagination
export const getTourReviews = async (tourID, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  // Get total count
  const [countResult] = await db.query(
    "SELECT COUNT(*) as total FROM reviews WHERE tourID = ?",
    [tourID]
  );
  const total = countResult[0].total;

  // Get reviews
  const [reviews] = await db.query(
    `SELECT 
      r.*,
      u.firstName,
      u.lastName,
      u.photoURL
    FROM reviews r
    INNER JOIN users u ON r.touristID = u.userID
    WHERE r.tourID = ?
    ORDER BY r.createdAt DESC
    LIMIT ? OFFSET ?`,
    [tourID, parseInt(limit), offset]
  );

  return {
    reviews,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Update tour
export const updateTour = async (tourID, guideID, updateData) => {
  const {
    title,
    duration,
    cityID,
    description,
    meetingPoint,
    gps_latitude,
    gps_longitude,
    photos,
    included,
    excluded,
    highlights,
    itinerary,
  } = updateData;

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // Verify ownership
    const [tour] = await conn.query(
      "SELECT guideID FROM tours WHERE tourID = ?",
      [tourID]
    );

    if (tour.length === 0 || tour[0].guideID !== guideID) {
      throw new Error("Unauthorized or tour not found");
    }

    // Build dynamic update
    const updates = [];
    const params = [];

    if (title) {
      updates.push("title = ?");
      params.push(title);
    }
    if (duration) {
      updates.push("duration = ?");
      params.push(duration);
    }
    if (cityID) {
      updates.push("cityID = ?");
      params.push(cityID);
    }
    if (description) {
      updates.push("description = ?");
      params.push(description);
    }
    if (meetingPoint) {
      updates.push("meetingPoint = ?");
      params.push(meetingPoint);
    }
    if (gps_latitude) {
      updates.push("gps_latitude = ?");
      params.push(gps_latitude);
    }
    if (gps_longitude) {
      updates.push("gps_longitude = ?");
      params.push(gps_longitude);
    }

    if (updates.length > 0) {
      params.push(tourID);
      await conn.query(
        `UPDATE tours SET ${updates.join(", ")} WHERE tourID = ?`,
        params
      );
    }

    if (included) {
      await conn.query("DELETE FROM tourincludeds WHERE tourID = ?", [tourID]);
      if (included.length > 0) {
        const includedValues = included.map((item) => [tourID, item]);
        await conn.query("INSERT INTO tourincludeds (tourID, item) VALUES ?", [
          includedValues,
        ]);
      }
    }

    if (excluded) {
      await conn.query("DELETE FROM tourexcludeds WHERE tourID = ?", [tourID]);
      if (excluded.length > 0) {
        const excludedValues = excluded.map((item) => [tourID, item]);
        await conn.query("INSERT INTO tourexcludeds (tourID, item) VALUES ?", [
          excludedValues,
        ]);
      }
    }

    if (highlights) {
      await conn.query("DELETE FROM tourhighlights WHERE tourID = ?", [tourID]);
      if (highlights.length > 0) {
        const highlightValues = highlights.map((highlight) => [
          tourID,
          highlight,
        ]);
        await conn.query(
          "INSERT INTO tourhighlights (tourID, highlight) VALUES ?",
          [highlightValues]
        );
      }
    }

    if (itinerary) {
      await conn.query("DELETE FROM itineraries WHERE tourID = ?", [tourID]);
      if (itinerary.length > 0) {
        const itineraryValues = itinerary.map((step, index) => [
          tourID,
          index + 1,
          step.stepTime || null,
          step.details,
        ]);
        await conn.query(
          "INSERT INTO itineraries (tourID, stepOrder, stepTime, details) VALUES ?",
          [itineraryValues]
        );
      }
    }

    await conn.commit();
    return { success: true };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

//Add tour photos (guide only, own tours)
export const addPhotos = async (tourID, photos) => {
  const values = photos.map((photoURL) => [photoURL, tourID]);

  await db.query(
    `
    INSERT INTO tourphotos (photoURL, tourID)
    VALUES ?
    `,
    [values]
  );
};

// Delete tour photo (guide only, own tours)
export const deletePhotos = async (tourID, photoIDs) => {
  const placeholders = photoIDs.map(() => "?").join(",");

  await db.query(
    `
    DELETE FROM tourphotos 
    WHERE tourID = ? 
    AND photoID IN (${placeholders})
    `,
    [tourID, ...photoIDs]
  );
};

// Delete tour
export const deleteTour = async (tourID, guideID) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // Verify ownership
    const [tour] = await conn.query(
      "SELECT guideID FROM tours WHERE tourID = ?",
      [tourID]
    );

    if (tour.length === 0 || tour[0].guideID !== guideID) {
      throw new Error("Unauthorized or tour not found");
    }

    // Check active reservations
    const [reservations] = await conn.query(
      'SELECT COUNT(*) as count FROM toreserve WHERE tourID = ? AND status IN ("pending", "confirmed")',
      [tourID]
    );

    if (reservations[0].count > 0) {
      throw new Error("Cannot delete tour with active reservations");
    }

    // Delete cascade
    await conn.query("DELETE FROM tourphotos WHERE tourID = ?", [tourID]);
    await conn.query("DELETE FROM tourincludeds WHERE tourID = ?", [tourID]);
    await conn.query("DELETE FROM tourexcludeds WHERE tourID = ?", [tourID]);
    await conn.query("DELETE FROM tourhighlights WHERE tourID = ?", [tourID]);
    await conn.query("DELETE FROM itineraries WHERE tourID = ?", [tourID]);
    await conn.query("DELETE FROM reviews WHERE tourID = ?", [tourID]);
    await conn.query("DELETE FROM tours WHERE tourID = ?", [tourID]);

    await conn.commit();
    return { success: true };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

// Get all cities
export const getAllCities = async () => {
  const [cities] = await db.query(
    "SELECT cityID, name FROM cities ORDER BY name ASC"
  );
  return cities;
};
