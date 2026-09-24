import SiteSettings from '../models/SiteSettings.js';

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();

    // Auto-create default settings document if none exists yet
    if (!settings) {
      settings = await SiteSettings.create({
        companyName: 'M/S LIGHT-HUT DECORATIVE SOLUTIONS',
        email: 'lighthutdecorativedlh@gmail.com',
        address: 'C37/4, LAWRENCE ROAD, INDUSTRIAL AREA, NEW DELHI -110035 (Near Metro Station Kanhaiya Nagar)',
        phone: '',
        whatsapp: '',
      });
    } else {
      let needsSave = false;
      if (!settings.companyName || settings.companyName !== 'M/S LIGHT-HUT DECORATIVE SOLUTIONS') {
        settings.companyName = 'M/S LIGHT-HUT DECORATIVE SOLUTIONS';
        needsSave = true;
      }
      if (!settings.email || settings.email !== 'lighthutdecorativedlh@gmail.com') {
        settings.email = 'lighthutdecorativedlh@gmail.com';
        needsSave = true;
      }
      if (!settings.address || settings.address.includes('Sadar Bazaar')) {
        settings.address = 'C37/4, LAWRENCE ROAD, INDUSTRIAL AREA, NEW DELHI -110035 (Near Metro Station Kanhaiya Nagar)';
        needsSave = true;
      }
      if (settings.phone) {
        settings.phone = '';
        needsSave = true;
      }
      if (settings.whatsapp) {
        settings.whatsapp = '';
        needsSave = true;
      }
      if (!settings.mapUrl) {
        settings.mapUrl = 'https://maps.google.com/maps?q=28.678613662719727%2C77.15131378173828&z=17&hl=en';
        needsSave = true;
      }
      if (settings.footerContent) {
        settings.footerContent.copyrightText = '© 2026 M/S LIGHT-HUT DECORATIVE SOLUTIONS. All Rights Reserved.';
        needsSave = true;
      }
      if (needsSave) {
        await settings.save();
      }
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private (Admin)
export const updateSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = new SiteSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Site settings updated successfully.',
      settings,
    });
  } catch (error) {
    next(error);
  }
};
