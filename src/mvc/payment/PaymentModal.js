const { connection } = require('../../../config/connection');

const LoanPaymentModel = {
  getLoanPaymentById(loanpayment_no, callback) {
    connection.query('SELECT * FROM loanpayment WHERE loanpayment_no = ? AND is_delete = 0', [loanpayment_no], callback);
  },

  getAllLoanPayments(callback) {
    connection.query('SELECT * FROM loanpayment WHERE is_delete = 0', callback);
  },

  addLoanPayment(loanpayment, callback) {
    const { loan_id, paymentType, transaction_id, transaction_amount, branchid, userid } = loanpayment;
    const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const defaultValues = 0;

    const query = 'INSERT INTO loanpayment (loan_id, paymentType, transaction_id, transaction_amount, branchid, userid, trndate, is_delete) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [loan_id, paymentType, transaction_id, transaction_amount, branchid, userid, trndate, defaultValues];

    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      const loanpayment_no = results.insertId;
      callback(null, loanpayment_no);
    });
  },

  updateLoanPayment(loanpayment, loanpayment_no, callback) {
    const { loan_id, paymentType, transaction_id, transaction_amount, branchid, userid } = loanpayment;
    const query = 'UPDATE loanpayment SET loan_id = ?, paymentType = ?, transaction_id = ?, transaction_amount = ?, branchid = ?, userid = ? WHERE loanpayment_no = ?';
    const values = [loan_id, paymentType, transaction_id, transaction_amount, branchid, userid, loanpayment_no];

    connection.query(query, values, callback);
  },

  deleteLoanPayment(loanpayment_no, value, callback) {
    const query = 'UPDATE loanpayment SET is_delete = ? WHERE loanpayment_no = ?';
    const values = [value, loanpayment_no];

    connection.query(query, values, callback);
  },
};

module.exports = LoanPaymentModel;
