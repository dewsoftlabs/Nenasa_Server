const permissionGroupView = {
    renderPermission(permission_group) { // <-- Make sure 'permission_group' is valid

        const { permission_code, assignpermissionid } = permission_group;

        const data = {
            assignpermissionid,
            permission_code
        };

        return data;
    },

    renderpermissionGroup(permissions) {
        return permissions.map(permissions => this.renderPermission(permissions));
    }
};

module.exports = permissionGroupView;