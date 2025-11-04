import Organization from "../models/organizationModel.js";
import Service from "../models/serviceModel.js";

export const addService = async (req, res) => {
    try {
        const { name, description, averageTimePerCustomer } = req.body;

        // Get organization from middleware (logged-in org)
        const organizationId = req.org.id;
        const organization = await Organization.findById(organizationId);

        if (!organization) {
            return res.json({ success: false, message: "Organization not found" });
        }

        const newService = new Service({
            name,
            description,
            organization: organizationId,
            averageTimePerCustomer: averageTimePerCustomer || 10,
        });

        await newService.save();
        
        // Add service to organization's services array
        organization.services.push(newService._id);
        await organization.save();

        res.json({
            success: true,
            message: "Service added successfully",
            service: newService,
        });
    } catch (error) {
        res.json({success:false , message: error.message });
    }
};
export const getOrgServices = async (req, res) => {
  try {
    const { orgId } = req.params;

    if (!orgId) {
      return res.status(400).json({ success: false, message: "Organization ID is required" });
    }

    const services = await Service.find({ organization: orgId });

    // Return empty array if no services found (not an error)
    res.json({ success: true, services: services || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Get All Services (for users)
export const getAllServices = async (req, res) => {
  try {
    // Optionally you can add filters later (category, org, etc.)
    const services = await Service.find()
      .populate("organization", "name address")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
    });
  }
};

export const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { name, description } = req.body;

    // find service and its organization
    const service = await Service.findById(serviceId).populate("organization");

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    // check if logged-in user owns this org
    const organization = await Organization.findById(service.organization._id);

    // if (!organization || organization.user.toString() !== req.user.id) {
    //   return res.status(403).json({ success: false, message: "Access denied: Not your organization" });
    // }

    service.name = name || service.name;
    service.description = description || service.description;
    // service.averageTimePerCustomer = avgTime || service.averageTimePerCustomer;

    await service.save();

    res.json({
      success: true,
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await Service.findById(serviceId).populate("organization");

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    const organization = await Organization.findById(service.organization._id);

    // if (!organization || organization.user.toString() !== req.user.id.toString()) {
    //   return res.status(403).json({ success: false, message: "Access denied: Not your organization" });
    // }

    await service.deleteOne();

    // optional: remove from org.services array
    organization.services = organization.services.filter(
      (id) => id.toString() !== serviceId.toString()
    );
    await organization.save();

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};