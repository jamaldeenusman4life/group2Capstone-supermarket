import * as customerService from "../services/customerService.js";

const getAllCustomers = async (req, res) => {
  try {
    const customers = await customerService.getAllCustomers();
    res.status(200).json({
      status: "success",
      results: customers.length,
      data: { customers },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getCustomer = async (req, res) => {
  try {
    const customer = await customerService.getCustomer(req.params.id);
    res.status(200).json({
      status: "success",
      data: { customer },
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const customer = await customerService.updateCustomer(
      req.params.id,
      req.body,
    );
    res.status(200).json({
      status: "success",
      data: { customer },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export { getAllCustomers, getCustomer, updateCustomer };
