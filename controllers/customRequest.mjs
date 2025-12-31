import * as customRequestModel from "../models/customRequest.mjs";
import { validationResult } from "express-validator";

/*
 GUIDE CONTROLLERS
 */

// Get all custom requests for guides to browse
export const getAllCustomRequests = async (req, res) => {
  try {
    const { cityID, status, keyword, page, limit } = req.query;

    const result = await customRequestModel.getAll(
      {
        cityID: cityID ? parseInt(cityID) : null,
        status,
        keyword,
        page: page || 1,
        limit: limit || 10,
      },
      req.user.userID
    );

    res.json({
      success: true,
      data: result.requests,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching custom requests",
    });
  }
};

// Get custom request details
export const getCustomRequestById = async (req, res) => {
  try {
    const { customRequestID } = req.params;
    const userID = req.user?.userID;

    const request = await customRequestModel.getById(customRequestID, userID);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Custom request not found or you do not have access",
      });
    }

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error("Error fetching custom request:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching custom request details",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Assign guide to custom request (guide applies)
export const assignGuide = async (req, res) => {
  try {
    const { customRequestID } = req.params;
    const guideID = req.user.userID;

    const result = await customRequestModel.assignGuide(
      customRequestID,
      guideID
    );

    res.json({
      success: true,
      message:
        "You have been successfully assigned to this custom request! The tourist will be notified.",
      data: result,
    });
  } catch (error) {
    console.error("Error assigning guide:", error);

    // Handle specific errors
    if (error.message.includes("already been assigned")) {
      return res.status(409).json({
        success: false,
        message: "This request has already been assigned to a guide",
      });
    }

    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        message: "Custom request not found",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Error assigning guide to request",
    });
  }
};

// Get guide's assigned custom requests
export const getGuideCustomRequests = async (req, res) => {
  try {
    const guideID = req.user.userID;
    const { status, page, limit } = req.query;

    const requests = await customRequestModel.getByGuide(guideID, {
      status,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    });

    res.json({
      success: true,
      data: requests,
      count: requests.length,
      message: `You have ${requests.length} assigned custom requests`,
    });
  } catch (error) {
    console.error("Error fetching guide custom requests:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching your assigned custom requests",
    });
  }
};

/*
TOURIST CONTROLLERS
 */

// Create a custom tour request
export const createCustomRequest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const touristID = req.user.userID;
    const requestData = {
      ...req.body,
      touristID,
    };

    const result = await customRequestModel.create(requestData);

    res.status(201).json({
      success: true,
      message:
        "Custom tour request created successfully! Guides will be able to see and apply to your request.",
      data: {
        customRequestID: result.customRequestID,
        status: result.status,
      },
    });
  } catch (error) {
    console.error("Error creating custom request:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error creating custom request",
    });
  }
};

// Get tourist's custom requests
export const getTouristCustomRequests = async (req, res) => {
  try {
    const touristID = req.user.userID;
    const { status, page, limit } = req.query;

    const requests = await customRequestModel.getByTourist(touristID, {
      status,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    });

    res.json({
      success: true,
      data: requests,
      count: requests.length,
      message: `You have created ${requests.length} custom requests`,
    });
  } catch (error) {
    console.error("Error fetching tourist custom requests:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching your custom requests",
    });
  }
};

// Delete custom request (tourist only, pending only)
export const deleteCustomRequest = async (req, res) => {
  try {
    const { customRequestID } = req.params;
    const touristID = req.user.userID;

    await customRequestModel.deleteCustomRequest(customRequestID, touristID);

    res.json({
      success: true,
      message: "Custom request deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting custom request:", error);

    if (error.message.includes("cannot be deleted")) {
      return res.status(403).json({
        success: false,
        message:
          "Request cannot be deleted (not found or already assigned to a guide)",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Error deleting custom request",
    });
  }
};

/*
 SHARED CONTROLLERS (Tourists & Guides)
 */

// Update custom request status
export const updateCustomRequestStatus = async (req, res) => {
  try {
    const { customRequestID } = req.params;
    const { status } = req.body;
    const userID = req.user.userID;

    // Validate status
    const validStatuses = ["pending", "assigned", "completed", "refused"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const result = await customRequestModel.updateStatus(
      customRequestID,
      userID,
      status
    );

    const statusMessages = {
      pending: "Status set to pending",
      assigned: "Status set to assigned",
      completed: "Custom request marked as completed",
      refused: "Custom request refused",
    };

    res.json({
      success: true,
      message: statusMessages[status],
      data: result,
    });
  } catch (error) {
    console.error("Error updating custom request status:", error);

    if (error.message.includes("Unauthorized")) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this request",
      });
    }

    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        message: "Custom request not found",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Error updating custom request status",
    });
  }
};
