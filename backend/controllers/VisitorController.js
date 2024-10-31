const Visitor = require('../models/Visitor');
const FollowUp = require('../models/FollowUp');
const { createAuditLog } = require('../utils/auditLogger');

class VisitorController {
  static async createVisitor(req, res) {
    try {
      const visitorData = {
        ...req.body,
        createdBy: req.user.id
      };

      const visitor = await Visitor.create(visitorData);
      
      // Create initial follow-up
      await FollowUp.create({
        visitor: visitor._id,
        type: 'phone',
        scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        assignedTo: req.user.id
      });

      // Log the action
      await createAuditLog({
        action: 'CREATE_VISITOR',
        userId: req.user.id,
        entityId: visitor._id,
        details: visitorData
      });

      res.status(201).json(visitor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getVisitors(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        startDate,
        endDate,
        search
      } = req.query;

      const query = {};

      if (status) query.status = status;
      if (startDate && endDate) {
        query.visitDate = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      if (search) {
        query.$or = [
          { firstName: new RegExp(search, 'i') },
          { lastName: new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') },
          { phone: new RegExp(search, 'i') }
        ];
      }

      const visitors = await Visitor.find(query)
        .sort({ visitDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('createdBy', 'name');

      const total = await Visitor.countDocuments(query);

      res.json({
        visitors,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // ... Additional controller methods ...
}

module.exports = VisitorController; 