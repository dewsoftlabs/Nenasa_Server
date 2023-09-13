const EmployeeView = {
    renderEmp(res, employee, token) {
        const { employeeid , employee_name, employee_address, employee_phone, employee_email, employee_gender, employee_nic, status, role } = employee;

        const data = {
            employeeData: {
                employee_name, employee_address, employee_phone, employee_email, employee_gender, employee_nic
            },
            status,
            role,
            employeeid,
            token
        }

        res.send(data);
    },
};

module.exports = EmployeeView;
