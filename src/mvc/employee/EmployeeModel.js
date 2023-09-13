const { connection } = require('../../../config/connection');

const EmployeeModel = {

    getEmployeeByEmail(employee_email, callback) {
        connection.query('SELECT * FROM employee WHERE email = ? AND is_delete = 0', [employee_email], callback);
    },

    getEmployeeByPhonenumber(employee_phone, callback) {
        connection.query('SELECT * FROM employee WHERE phonenumber = ? AND is_delete = 0', [employee_phone], callback);
    },

    getEmployeeByEmpname(employee_name, callback) {
        connection.query('SELECT * FROM employee WHERE name = ? AND is_delete = 0', [employee_name], callback);
    },

    addEmployee(employee, callback) {
    const { employee_name, employee_address, employee_phone, employee_email, employee_gender, employee_nic, status, role } = employee;
    const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const defaultvalues = 0;
    const activevalues=0;

    const updateEmpty = "";

    const query = 'INSERT INTO employee (name, address, phonenumber , email, gender, nic, status , roleid, trndate, is_delete,) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)';
    const values = [employee_name, employee_address, employee_phone, employee_email, employee_gender, employee_nic, status, role, trndate, activevalues, defaultvalues, updateEmpty ];

    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      const employeeId = results.insertId;
      callback(null, employeeId);
    });
  },
}

module.exports = EmployeeModel;