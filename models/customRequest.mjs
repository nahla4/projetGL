import db from "../config/db.mjs";

// Create a new custom tour request
export const create = async (requestData) => {
  const {
    touristID,
    requestedCityID,
    gps_latitude = null,
    gps_longitude = null,
    startDate,
    endDate,
    title,
    description,
  } = requestData;

  const [result] = await db.query(
    `
    INSERT INTO customRequests (
      touristID,
      requestedCityID,
      gps_latitude,
      gps_longitude,
      startDate,
      endDate,
      title,
      description
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      touristID,
      requestedCityID,
      gps_latitude,
      gps_longitude,
      startDate,
      endDate,
      title,
      description,
    ]
  );

  return {
    customRequestID: result.insertId,
    status: "pending",
  };
};

// Get all custom requests (for guides to browse)
export const getAll = async (filters = {}, guideID) => {
  const { cityID, status, keyword, page = 1, limit = 10 } = filters;

  const safeLimit = Math.min(parseInt(limit), 50);
  const offset = (page - 1) * safeLimit;

  let query = `
    SELECT 
      cr.*,
      u.firstName AS touristFirstName,
      u.lastName AS touristLastName,
      u.photoURL AS touristPhoto,
      c.name AS cityName,
      g.firstName AS assignedGuideFirstName,
      g.lastName AS assignedGuideLastName
    FROM customrequests cr
    INNER JOIN users u ON cr.touristID = u.userID
    INNER JOIN cities c ON cr.requestedCityID = c.cityID
    LEFT JOIN users g ON cr.assignedGuideID = g.userID
    WHERE 
    (
        cr.status = 'pending'
        OR (cr.status = 'assigned' AND cr.assignedGuideID = ?)
      )
  `;

  const params = [guideID];

  if (cityID) {
    query += ` AND cr.requestedCityID = ?`;
    params.push(cityID);
  }

  if (status) {
    query += ` AND cr.status = ?`;
    params.push(status);
  }

  if (keyword) {
    query += ` AND (
      cr.title LIKE ?
      OR cr.description LIKE ?
    )`;
    params.push(`%${keyword}%`, `%${keyword}%`);
  }

  // Count query
  const countQuery = query.replace(
    /SELECT[\s\S]+?FROM/,
    "SELECT COUNT(*) as total FROM"
  );

  const [countResult] = await db.query(countQuery, params);
  const total = countResult[0].total;

  query += ` ORDER BY cr.createdAt DESC LIMIT ? OFFSET ?`;
  params.push(safeLimit, offset);

  const [requests] = await db.query(query, params);

  return {
    requests,
    pagination: {
      page: parseInt(page),
      limit: safeLimit,
      total,
      pages: Math.ceil(total / safeLimit),
    },
  };
};

// Get custom request by ID
export const getById = async (customRequestID, userID = null) => {
  let query = `
    SELECT 
      cr.*,
      u.firstName as touristFirstName,
      u.lastName as touristLastName,
      u.photoURL as touristPhoto,
      u.phoneNumber as touristPhone,
      c.name as cityName,
      CASE WHEN cr.assignedGuideID IS NOT NULL THEN g.firstName ELSE NULL END as assignedGuideFirstName,
      CASE WHEN cr.assignedGuideID IS NOT NULL THEN g.lastName ELSE NULL END as assignedGuideLastName,
      CASE WHEN cr.assignedGuideID IS NOT NULL THEN g.phoneNumber ELSE NULL END as assignedGuidePhone
    FROM customrequests cr
    INNER JOIN users u ON cr.touristID = u.userID
    LEFT JOIN cities c ON cr.requestedCityID = c.cityID
    LEFT JOIN users g ON cr.assignedGuideID = g.userID
    WHERE cr.customRequestID = ?
  `;

  const params = [customRequestID];

  // Access control:
  // - Tourist can see their own requests
  // - Guide can see requests assigned to them OR pending requests (to browse and apply)
  // - If no userID provided, allow access (for public endpoints if needed)
  if (userID) {
    // First check if user is a guide - we need to get user role
    const [userCheck] = await db.query(
      "SELECT role FROM users WHERE userID = ?",
      [userID]
    );
    const isGuide = userCheck.length > 0 && userCheck[0].role === "guide";

    if (isGuide) {
      // Guides can see: assigned to them OR pending (to browse)
      query += ` AND (cr.assignedGuideID = ? OR cr.status = 'pending')`;
      params.push(userID);
    } else {
      // Tourists can only see their own requests
      query += ` AND cr.touristID = ?`;
      params.push(userID);
    }
  }

  try {
    const [requests] = await db.query(query, params);

    return requests.length > 0 ? requests[0] : null;
  } catch (error) {
    throw error;
  }
};

// Get tourist's custom requests
export const getByTourist = async (touristID, filters = {}) => {
  const { status, page = 1, limit = 10 } = filters;
  const offset = (page - 1) * limit;

  let query = `
    SELECT 
      cr.*,
      c.name as cityName,
      CASE WHEN cr.assignedGuideID IS NOT NULL THEN g.firstName ELSE NULL END as assignedGuideFirstName,
      CASE WHEN cr.assignedGuideID IS NOT NULL THEN g.lastName ELSE NULL END as assignedGuideLastName,
      CASE WHEN cr.assignedGuideID IS NOT NULL THEN g.photoURL ELSE NULL END as assignedGuidePhoto
    FROM customrequests cr
    INNER JOIN cities c ON cr.requestedCityID = c.cityID
    LEFT JOIN users g ON cr.assignedGuideID = g.userID
    WHERE cr.touristID = ?
  `;

  const params = [touristID];

  if (status) {
    query += ` AND cr.status = ?`;
    params.push(status);
  }

  query += ` ORDER BY cr.createdAt DESC LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), offset);

  const [requests] = await db.query(query, params);
  return requests;
};

// Get guide's assigned custom requests
export const getByGuide = async (guideID, filters = {}) => {
  const { status, page = 1, limit = 10 } = filters;
  const offset = (page - 1) * limit;

  let query = `
    SELECT 
      cr.*,
      u.firstName as touristFirstName,
      u.lastName as touristLastName,
      u.photoURL as touristPhoto,
      u.phoneNumber as touristPhone,
      c.name as cityName
    FROM customrequests cr
    INNER JOIN users u ON cr.touristID = u.userID
    INNER JOIN cities c ON cr.requestedCityID = c.cityID
    WHERE cr.assignedGuideID = ?
  `;

  const params = [guideID];

  if (status) {
    query += ` AND cr.status = ?`;
    params.push(status);
  }

  query += ` ORDER BY cr.createdAt DESC LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), offset);

  const [requests] = await db.query(query, params);
  return requests;
};

// Assign guide to custom request
export const assignGuide = async (customRequestID, guideID) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // Check if request is still pending
    const [request] = await conn.query(
      "SELECT status, touristID FROM customrequests WHERE customRequestID = ?",
      [customRequestID]
    );

    if (request.length === 0) {
      throw new Error("Custom request not found");
    }

    if (request[0].status !== "pending") {
      throw new Error("This request has already been assigned or closed");
    }

    // Verify guide exists
    const [guide] = await conn.query(
      'SELECT userID FROM users WHERE userID = ? AND role = "guide"',
      [guideID]
    );

    if (guide.length === 0) {
      throw new Error("Guide not found");
    }

    // Assign guide
    await conn.query(
      'UPDATE customrequests SET assignedGuideID = ?, status = "assigned" WHERE customRequestID = ?',
      [guideID, customRequestID]
    );

    await conn.commit();
    return { success: true, status: "assigned" };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

// Update custom request status
export const updateStatus = async (customRequestID, userID, newStatus) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // Verify user can update this request
    const [request] = await conn.query(
      "SELECT touristID, assignedGuideID FROM customrequests WHERE customRequestID = ?",
      [customRequestID]
    );

    if (request.length === 0) {
      throw new Error("Custom request not found");
    }

    const canUpdate =
      request[0].touristID === userID || request[0].assignedGuideID === userID;
    if (!canUpdate) {
      throw new Error("Unauthorized to update this request");
    }

    // Validate status
    const validStatuses = ["pending", "assigned", "completed", "refused"];
    if (!validStatuses.includes(newStatus)) {
      throw new Error("Invalid status");
    }

    await conn.query(
      "UPDATE customrequests SET status = ? WHERE customRequestID = ?",
      [newStatus, customRequestID]
    );

    await conn.commit();
    return { success: true, status: newStatus };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

// Delete custom request (only by tourist, only if pending)
export const deleteCustomRequest = async (customRequestID, touristID) => {
  const [result] = await db.query(
    'DELETE FROM customrequests WHERE customRequestID = ? AND touristID = ? AND status = "pending"',
    [customRequestID, touristID]
  );

  if (result.affectedRows === 0) {
    throw new Error(
      "Request not found or cannot be deleted (already assigned)"
    );
  }

  return { success: true };
};
