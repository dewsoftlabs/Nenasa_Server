const TermsModel = require("./TermsModel");

const getAllTerms = (req, res) => {
    TermsModel.getAllTerms((error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        res.status(200).send(results);
    });
};

const getTermsById = (req, res) => {
    const { terms_id } = req.params;
    TermsModel.getTermsById(terms_id, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Term not found' });
            return;
        }

        res.status(200).send(results);
    });
};

const addTerms = (req, res) => {
    const terms = req.body;
  
    TermsModel.getTermsByAmount(terms.no_of_terms, (error, results) => {
      if (error) {
        res.status(500).send({ error: "Error fetching data from the database" });
        return;
      }
  
      if (results.length > 0) {
        res.status(409).send({ error: "This Term is already exists" });
        return;
      }
  
      TermsModel.addTerms(terms, (error, terms_id) => {
        if (error) {
          res
            .status(500)
            .send({ error: "Error fetching data from the database" });
          return;
        }
  
        if (!terms_id) {
          res.status(404).send({ error: "Failed to create Term" });
          return;
        }
  
        res.status(200).send({ message: "Term created successfully", terms_id });
      });
    });
  };

  const updateTerms = (req, res) => {
    const { terms_id } = req.params;
    const terms = req.body;
  
    TermsModel.getTermsById(terms_id, (error, existingterm) => {
      if (error) {
        res.status(500).send({ error: "Error fetching data from the database" });
        return;
      }
  
      if (!existingterm[0]) {
        res.status(404).send({ error: "Term not found" });
        return;
      }
  
      if (terms.no_of_terms && terms.no_of_terms !== existingterm[0].no_of_terms) {
        TermsModel.getTermsByAmount(terms.no_of_terms, (error, results) => {
          if (error) {
            res
              .status(500)
              .send({ error: "Error fetching data from the database" });
            return;
          }
  
          if (results.length > 0) {
            res.status(409).send({ error: "This Term is already exists" });
            return;
          }
  
          updateExistingTerm(terms, terms_id);
        });
      } else {
        updateExistingTerm(terms, terms_id);
      }
    });
  
    function updateExistingTerm(terms, terms_id) {
      TermsModel.updateTerms(terms, terms_id, (error, results) => {
        if (error) {
          res
            .status(500)
            .send({ error: "Error fetching data from the database" });
          return;
        }
  
        if (results.affectedRows === 0) {
          res.status(404).send({ error: "Term not found or no changes made" });
          return;
        }
  
        res.status(200).send({ message: "Term updated successfully" });
      });
    }
  };

  const deleteTerm = (req, res) => {
    const { terms_id } = req.params;

    TermsModel.getTermsById(terms_id, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Term not found' });
            return;
        }

        TermsModel.deleteTerm(terms_id, 1, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating deletion in the database' });
                return;
            }

            res.status(200).send({ message: 'Term deleted successfully' });
        });
    });
};

const deleteTerms = (req, res) => {
    const { termIds } = req.body;

    if (!Array.isArray(termIds) || termIds.length === 0) {
        res.status(400).send({ error: 'Invalid Term IDs' });
        return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const terms_id of termIds) {
        TermsModel.getTermsById(terms_id, (error, results) => {
            if (error) {
                console.error(`Error fetching term with ID ${terms_id}: ${error}`);
                failCount++;
            } else if (results.length === 0) {
                console.log(`Term with ID ${terms_id} not found`);
                failCount++;
            } else {
                TermsModel.deleteTerm(terms_id, 1, (deleteError, deleteResult) => {
                    if (deleteError) {
                        console.error(`Error deleting term with ID ${terms_id}: ${deleteError}`);
                        failCount++;
                    } else {
                        successCount++;
                        console.log(`Term with ID ${terms_id} deleted successfully`);
                    }

                    // Check if all deletions have been processed
                    if (successCount + failCount === termIds.length) {
                        const totalCount = termIds.length;
                        res.status(200).send({
                            totalCount,
                            successCount,
                            failCount,
                        });
                    }
                });
            }

            // Check if all categories have been processed
            if (successCount + failCount === termIds.length) {
                const totalCount = termIds.length;
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
    getAllTerms,
    getTermsById,
    addTerms,
    updateTerms,
    deleteTerm,
    deleteTerms,
}