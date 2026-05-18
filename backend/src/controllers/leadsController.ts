import { Request, Response, NextFunction } from 'express';
import Lead from '../models/Lead';
import { AppError } from '../utils/errors';
import { AuthenticatedRequest } from '../middlewares/auth';

export const createLead = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, status, source } = req.body;

    const newLead = await Lead.create({
      name,
      email,
      status: status || 'new',
      source,
      createdBy: req.user!._id,
    });

    const populatedLead = await Lead.findById(newLead._id).populate('createdBy', 'name email role');

    res.status(201).json({
      status: 'success',
      data: {
        lead: populatedLead,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getLeads = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { search, status, source, sort, page = '1', limit = '10' } = req.query;

    const queryObject: any = {};

    // 1) Search
    if (search && typeof search === 'string') {
      queryObject.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // 2) Filter by Status
    if (status && typeof status === 'string' && status !== 'all') {
      queryObject.status = status;
    }

    // 3) Filter by Source
    if (source && typeof source === 'string' && source !== 'all') {
      queryObject.source = source;
    }

    // Pagination numbers
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skipNum = (pageNum - 1) * limitNum;

    // Build query
    let query = Lead.find(queryObject).populate('createdBy', 'name email role');

    // 4) Sorting
    if (sort === 'oldest') {
      query = query.sort({ createdAt: 1 });
    } else {
      query = query.sort({ createdAt: -1 }); // default: latest
    }

    // Total records matching filters
    const totalLeads = await Lead.countDocuments(queryObject);

    // Apply pagination
    const leads = await query.skip(skipNum).limit(limitNum);

    // Calculate real-time stats count matching current search filter
    const statsQueryObject = { ...queryObject };
    delete statsQueryObject.status;
    delete statsQueryObject.source;

    const stats = {
      total: await Lead.countDocuments(statsQueryObject),
      new: await Lead.countDocuments({ ...statsQueryObject, status: 'new' }),
      contacted: await Lead.countDocuments({ ...statsQueryObject, status: 'contacted' }),
      qualified: await Lead.countDocuments({ ...statsQueryObject, status: 'qualified' }),
      lost: await Lead.countDocuments({ ...statsQueryObject, status: 'lost' }),
      website: await Lead.countDocuments({ ...statsQueryObject, source: 'website' }),
      instagram: await Lead.countDocuments({ ...statsQueryObject, source: 'instagram' }),
      referral: await Lead.countDocuments({ ...statsQueryObject, source: 'referral' }),
    };

    res.status(200).json({
      status: 'success',
      results: leads.length,
      pagination: {
        total: totalLeads,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(totalLeads / limitNum),
      },
      stats,
      data: {
        leads,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getLead = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email role');

    if (!lead) {
      return next(new AppError('No lead found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        lead,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, status, source } = req.body;

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return next(new AppError('No lead found with that ID', 404));
    }

    // Update details
    if (name !== undefined) lead.name = name;
    if (email !== undefined) lead.email = email;
    if (status !== undefined) lead.status = status as any;
    if (source !== undefined) lead.source = source as any;

    await lead.save();

    const updatedLead = await Lead.findById(lead._id).populate('createdBy', 'name email role');

    res.status(200).json({
      status: 'success',
      data: {
        lead: updatedLead,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return next(new AppError('No lead found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const exportLeadsCSV = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { search, status, source, sort } = req.query;

    const queryObject: any = {};

    if (search && typeof search === 'string') {
      queryObject.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (status && typeof status === 'string' && status !== 'all') {
      queryObject.status = status;
    }

    if (source && typeof source === 'string' && source !== 'all') {
      queryObject.source = source;
    }

    let query = Lead.find(queryObject).populate('createdBy', 'name email role');

    if (sort === 'oldest') {
      query = query.sort({ createdAt: 1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const leads = await query;

    // Convert to CSV
    const headers = ['ID', 'Name', 'Email', 'Status', 'Source', 'Created By', 'Created At'];
    const rows = leads.map((lead) => [
      lead._id,
      `"${lead.name.replace(/"/g, '""')}"`,
      `"${lead.email.replace(/"/g, '""')}"`,
      lead.status,
      lead.source,
      `"${(lead.createdBy as any)?.name?.replace(/"/g, '""') || 'N/A'}"`,
      lead.createdAt.toISOString(),
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=leads-export-${new Date().toISOString().split('T')[0]}.csv`);
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};
