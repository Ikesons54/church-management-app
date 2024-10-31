const AuditLog = require('../models/AuditLog');

const auditLogger = async (req, res, next) => {
  const originalSend = res.send;

  res.send = function (data) {
    res.send = originalSend;
    
    const log = {
      user: req.user?._id,
      action: determineAction(req.method, req.path),
      details: `${req.method} ${req.path}`,
      ipAddress: req.ip,
      timestamp: new Date(),
      status: res.statusCode,
      requestBody: req.body,
      responseBody: JSON.parse(data)
    };

    AuditLog.create(log).catch(console.error);
    
    return res.send(data);
  };

  next();
};

const determineAction = (method, path) => {
  switch (method) {
    case 'POST': return 'CREATE';
    case 'PUT':
    case 'PATCH': return 'UPDATE';
    case 'DELETE': return 'DELETE';
    default: return 'READ';
  }
};

module.exports = auditLogger; 