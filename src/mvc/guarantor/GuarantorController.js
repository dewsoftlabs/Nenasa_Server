const GuarantorModel = require("./GuarantorModel");

const mobileNumberPattern = /^[+0-9]{12}$/;
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const validateMobileNumber = (mobileNumber) => {
    return mobileNumberPattern.test(mobileNumber);
  };

const validateEmail = (email) => {
    return emailPattern.test(email);
};

const getAllGuarantors = (req, res) => {
    GuarantorModel.getAllGuarantors((error, results) => {
      if (error) {
        res.status(500).send({ error: "Error fetching data from the database" });
        return;
      }
  
      res.status(200).send(results);
    });
  };

  const getGuarantorById = (req, res) => {
    const { guarantor_id } = req.params;
  
    GuarantorModel.getGuarantorById(guarantor_id, (error, results) => {
      if (error) {
        res.status(500).send({ error: "Error fetching data from the database" });
        return;
      }
  
      res.status(200).send(results);
    });
  };

  const addGuarantor = (req, res) => {
    const guarantor = req.body; // Retrieve the user data from the request body
  
    if (!validateMobileNumber(guarantor.guarantor_phone)) {
      res.status(400).send({ error: "Invalid mobile number" });
      return;
    }
  
    if (!validateEmail(guarantor.guarantor_email)) {
      res.status(400).send({ error: "Invalid email" });
      return;
    }
  
    GuarantorModel.getGuarantorByemail(
      guarantor.guarantor_email,
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

        GuarantorModel.getGuarantorByphone(
          guarantor.guarantor_phone,
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
            GuarantorModel.addGuarantor(guarantor, (error, guarantor_id) => {
              if (error) {
                res
                  .status(500)
                  .send({ error: "Error fetching data from the database" });
                return;
              }
  
              if (!guarantor_id) {
                res.status(500).send({ error: "Failed to create Guarantor" });
                return;
              }
  
              res
                .status(200)
                .send({ message: "Guarantor created successfully", guarantor_id });
            });
          }
        );
      }
    );
  };

  const updateGuarantor = (req, res) => {
    const { guarantor_id } = req.params;
    const guarantor = req.body;
  
    if (!validateMobileNumber(guarantor.guarantor_phone)) {
      res.status(400).send({ error: "Invalid mobile number" });
      return;
    }
  
    if (!validateEmail(guarantor.guarantor_email)) {
      res.status(400).send({ error: "Invalid email" });
      return;
    }
  
    // Check if the item exists before updating
    GuarantorModel.getGuarantorById(guarantor_id, (error, existingGuarantor) => {
      if (error) {
        res.status(500).send({ error: "Error fetching data from the database" });
        return;
      }
  
      if (existingGuarantor.length === 0) {
        res.status(404).send({ error: "Guarantor not found" });
        return;
      }
  
      // Check if the provided item_code is already associated with another item
      if (
        guarantor.guarantor_email &&
        guarantor.guarantor_email !== existingGuarantor[0].guarantor_email
      ) {
        GuarantorModel.getGuarantorByemail(
          guarantor.guarantor_email,
          (error, mailResults) => {
            if (error) {
              res
                .status(500)
                .send({ error: "Error fetching data from the database" });
              return;
            }
  
            if (mailResults.length > 0) {
              res.status(409).send({
                error: "This email is already associated with another guarantor",
              });
              return;
            }
  
            // Call the next check
            checkGuarantorPhone(guarantor, existingGuarantor, guarantor_id);
          }
        );
      } else {
        // Call the next check
        checkGuarantorPhone(guarantor, existingGuarantor, guarantor_id);
      }
    });
  
    function checkGuarantorPhone(guarantor, existingGuarantor, guarantor_id) {
      if (
        guarantor.guarantor_phone &&
        guarantor.guarantor_phone !== existingGuarantor[0].guarantor_phone
      ) {
        if (guarantor_id != existingGuarantor[0].guarantor_id) {
          GuarantorModel.checkGuarantorPhone(
            guarantor.guarantor_phone,
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
                    "This phone number is already associated with another guarantor",
                });
                return;
              }
  
              // Proceed with the update
              updateExistingGuarantor(guarantor, guarantor_id);
            }
          );
        } else {
          updateExistingGuarantor(guarantor, guarantor_id);
        }
      } else {
        // Proceed with the update
        updateExistingGuarantor(guarantor, guarantor_id);
      }
    }
  
    function updateExistingGuarantor(guarantor, guarantor_id) {
      GuarantorModel.updateGuarantor(
        guarantor,
        guarantor_id,
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
              .send({ error: "Guarantor not found or no changes made" });
            return;
          }
  
          res.status(200).send({ message: "Guarantor updated successfully" });
        }
      );
    }
  };

  const deleteGuarantor = (req, res) => {
    const { guarantor_id } = req.params;
  
    GuarantorModel.getGuarantorById(guarantor_id, (error, guarantor) => {
      if (error) {
        res.status(500).send({ error: "Error fetching data from the database" });
        return;
      }
  
      if (!guarantor[0]) {
        res.status(404).send({ error: "Guarantor not found" });
        return;
      }
  
      GuarantorModel.deleteGuarantor(guarantor_id, 1, (error, results) => {
        if (error) {
          res
            .status(500)
            .send({ error: "Error updating Deleteing in the database" });
          return;
        }
  
        res.status(200).send({ message: "Guarantor Delete successfully" });
      });
    });
  };

  const deleteGuarantors = (req, res) => {
    const { guarantorIds } = req.body;
  
    if (!Array.isArray(guarantorIds) || guarantorIds.length === 0) {
      res.status(400).send({ error: "Invalid guarantor IDs" });
      return;
    }
  
    let successCount = 0;
    let failCount = 0;
  
    for (const guarantor_id of guarantorIds) {
      GuarantorModel.getGuarantorById(guarantor_id, (error, results) => {
        if (error) {
          console.error(
            `Error fetching guarantor with ID ${guarantor_id}: ${error}`
          );
          failCount++;
        } else if (results.length === 0) {
          console.log(`guarantor with ID ${guarantor_id} not found`);
          failCount++;
        } else {
          GuarantorModel.deleteGuarantor(
            guarantor_id,
            1,
            (deleteError, deleteResult) => {
              if (deleteError) {
                console.error(
                  `Error deleting guarantor with ID ${guarantor_id}: ${deleteError}`
                );
                failCount++;
              } else {
                successCount++;
                console.log(
                  `guarantor with ID ${guarantor_id} deleted successfully`
                );
              }
  
              // Check if all deletions have been processed
              if (successCount + failCount === guarantorIds.length) {
                const totalCount = guarantorIds.length;
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
        if (successCount + failCount === guarantorIds.length) {
          const totalCount = guarantorIds.length;
          res.status(200).send({
            totalCount,
            successCount,
            failCount,
          });
        }
      });
    }
  };

module.exports = {
    validateEmail,
    validateMobileNumber,
    getAllGuarantors,
    getGuarantorById,
    addGuarantor,
    updateGuarantor,
    deleteGuarantor,
    deleteGuarantors,
}