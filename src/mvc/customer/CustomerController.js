const CustomerModel = require("./CustomerModel");

// Regular expression patterns for mobile number and email validation
const mobileNumberPattern = /^[+0-9]{12}$/;
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const validateMobileNumber = (mobileNumber) => {
  return mobileNumberPattern.test(mobileNumber);
};

const validateEmail = (email) => {
  return emailPattern.test(email);
};

const getAllCustomers = (req, res) => {
  CustomerModel.getAllCustomers((error, results) => {
    if (error) {
      res.status(500).send({ error: "Error fetching data from the database" });
      return;
    }

    res.status(200).send(results);
  });
};

const getCustomerById = (req, res) => {
  const { customer_id } = req.params;

  CustomerModel.getCustomerById(customer_id, (error, results) => {
    if (error) {
      res.status(500).send({ error: "Error fetching data from the database" });
      return;
    }

    res.status(200).send(results);
  });
};

const addCustomer = (req, res) => {
  const customer = req.body; // Retrieve the user data from the request body

  if (!validateMobileNumber(customer.customer_phone)) {
    res.status(400).send({ error: "Invalid mobile number" });
    return;
  }

  if (!validateEmail(customer.customer_email)) {
    res.status(400).send({ error: "Invalid email" });
    return;
  }

  CustomerModel.getCustomerByemail(
    customer.customer_email,
    (error, results) => {
      if (error) {
        res
          .status(500)
          .send({ error: "Error fetching data from the database" });
        return;
      }

      if (results.length > 0) {
        res.status(409).send({ error: "Email already exists" });
        return;
      }

      //console.log(customer.customer_phone);

      CustomerModel.getCustomerByphone(
        customer.customer_phone,
        (error, results) => {
          if (error) {
            res
              .status(500)
              .send({ error: "Error fetching data from the database" });
            return;
          }

          if (results.length > 0) {
            res.status(409).send({ error: "Phone number already exists" });
            return;
          }
          CustomerModel.addCustomer(customer, (error, customer_id) => {
            if (error) {
              res
                .status(500)
                .send({ error: "Error fetching data from the database" });
              return;
            }

            if (!customer_id) {
              res.status(500).send({ error: "Failed to create customer" });
              return;
            }

            res
              .status(200)
              .send({ message: "customer created successfully", customer_id });
          });
        }
      );
    }
  );
};

const updateCustomer = (req, res) => {
  const { customer_id } = req.params;
  const customer = req.body;

  if (!validateMobileNumber(customer.customer_phone)) {
    res.status(400).send({ error: "Invalid mobile number" });
    return;
  }

  if (!validateEmail(customer.customer_email)) {
    res.status(400).send({ error: "Invalid email" });
    return;
  }

  // Check if the item exists before updating
  CustomerModel.getCustomerById(customer_id, (error, existingCustomer) => {
    if (error) {
      res.status(500).send({ error: "Error fetching data from the database" });
      return;
    }

    if (existingCustomer.length === 0) {
      res.status(404).send({ error: "Customer not found" });
      return;
    }

    // Check if the provided item_code is already associated with another item
    if (
      customer.customer_email &&
      customer.customer_email !== existingCustomer[0].customer_email
    ) {
      CustomerModel.getCustomerByemail(
        customer.customer_email,
        (error, mailResults) => {
          if (error) {
            res
              .status(500)
              .send({ error: "Error fetching data from the database" });
            return;
          }

          if (mailResults.length > 0) {
            res.status(409).send({
              error: "This email is already associated with another customer",
            });
            return;
          }

          // Call the next check
          checkCustomerPhone(customer, existingCustomer, customer_id);
        }
      );
    } else {
      // Call the next check
      checkCustomerPhone(customer, existingCustomer, customer_id);
    }
  });

  function checkCustomerPhone(customer, existingCustomer, customer_id) {
    if (
      customer.customer_phone &&
      customer.customer_phone !== existingCustomer[0].customer_phone
    ) {
      if (customer_id != existingCustomer[0].customer_id) {
        CustomerModel.getCustomerByphone(
          customer.customer_phone,
          (error, phoneResults) => {
            if (error) {
              res
                .status(500)
                .send({ error: "Error fetching data from the database" });
              return;
            }

            if (phoneResults.length > 0) {
              res.status(409).send({
                error:
                  "This phone number is already associated with another customer",
              });
              return;
            }

            // Proceed with the update
            updateExistingCustomer(customer, customer_id);
          }
        );
      } else {
        updateExistingCustomer(customer, customer_id);
      }
    } else {
      // Proceed with the update
      updateExistingCustomer(customer, customer_id);
    }
  }

  function updateExistingCustomer(customer, customer_id) {
    CustomerModel.updateCustomer(
      customer,
      customer_id,
      (updateError, updateResults) => {
        if (updateError) {
          res
            .status(500)
            .send({ error: "Error updating item in the database" });
          return;
        }

        if (updateResults.affectedRows === 0) {
          res
            .status(404)
            .send({ error: "customer not found or no changes made" });
          return;
        }

        res.status(200).send({ message: "customer updated successfully" });
      }
    );
  }
};

const deleteCustomers = (req, res) => {
  const { customerIds } = req.body;

  if (!Array.isArray(customerIds) || customerIds.length === 0) {
    res.status(400).send({ error: "Invalid customer IDs" });
    return;
  }

  let successCount = 0;
  let failCount = 0;

  for (const customer_id of customerIds) {
    CustomerModel.getCustomerById(customer_id, (error, results) => {
      if (error) {
        console.error(
          `Error fetching customer with ID ${customer_id}: ${error}`
        );
        failCount++;
      } else if (results.length === 0) {
        console.log(`customer with ID ${customer_id} not found`);
        failCount++;
      } else {
        CustomerModel.deleteCustomer(
          customer_id,
          1,
          (deleteError, deleteResult) => {
            if (deleteError) {
              console.error(
                `Error deleting customer with ID ${customer_id}: ${deleteError}`
              );
              failCount++;
            } else {
              successCount++;
              console.log(
                `customer with ID ${customer_id} deleted successfully`
              );
            }

            // Check if all deletions have been processed
            if (successCount + failCount === customerIds.length) {
              const totalCount = customerIds.length;
              res.status(200).send({
                totalCount,
                successCount,
                failCount,
              });
            }
          }
        );
      }

      // Check if all brands have been processed
      if (successCount + failCount === customerIds.length) {
        const totalCount = customerIds.length;
        res.status(200).send({
          totalCount,
          successCount,
          failCount,
        });
      }
    });
  }
};

const deleteCustomer = (req, res) => {
  const { customer_id } = req.params;

  CustomerModel.getCustomerById(customer_id, (error, customer) => {
    if (error) {
      res.status(500).send({ error: "Error fetching data from the database" });
      return;
    }

    if (!customer[0]) {
      res.status(404).send({ error: "Customer not found" });
      return;
    }

    CustomerModel.deleteCustomer(customer_id, 1, (error, results) => {
      if (error) {
        res
          .status(500)
          .send({ error: "Error updating Deleteing in the database" });
        return;
      }

      res.status(200).send({ message: "Customer Delete successfully" });
    });
  });
};

const updateCustomerStatus = (req, res) => {

  const { customer_id } = req.params;
  const { status } = req.body;

  CustomerModel.getCustomerById(customer_id, (error, results) => {
    if (error) {
      res.status(500).send({ error: "Error fetching data from the database" });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: "Customer not found" });
      return;
    }

    CustomerModel.updateCustomerstatus(customer_id, status, (error, results) => {
      if (error) {
        res
          .status(500)
          .send({ error: "Error updating status in the database" });
        return;
      }

      res.status(200).send({ message: "Status updated successfully" });
    });
  });
};

module.exports = {
  addCustomer,
  updateCustomer,
  getAllCustomers,
  getCustomerById,
  deleteCustomers,
  deleteCustomer,
  updateCustomerStatus,
};
