import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DataTable from '@/components/molecules/DataTable';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { adminUsersService } from '@/services/api/adminUsersService';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [users, searchTerm]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminUsersService.getAll();
      setUsers(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load admin users');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    navigate(`/admin-users/edit/${user.Id}`);
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        await adminUsersService.delete(user.Id);
        await loadUsers();
      } catch (err) {
        toast.error('Failed to delete admin user');
      }
    }
  };

  const handleCreateNew = () => {
    navigate('/admin-users/new');
  };

  const getStatusBadgeVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'secondary';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role.toLowerCase()) {
      case 'super admin':
        return 'primary';
      case 'admin':
        return 'secondary';
      case 'moderator':
        return 'accent';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      type: 'badge',
      getBadgeVariant: getRoleBadgeVariant
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      type: 'badge',
      getBadgeVariant: getStatusBadgeVariant
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      type: 'date'
    },
    {
      key: 'lastLogin',
      label: 'Last Login',
      sortable: true,
      render: (value) => value ? new Date(value).toLocaleDateString() : 'Never'
    }
  ];

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadUsers} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Admin Users</h1>
          <p className="text-gray-400 mt-1">Manage administrator accounts and permissions</p>
        </div>
        <Button onClick={handleCreateNew} className="sm:w-auto">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Admin User
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-80">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search users..."
          />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <Empty
          title="No admin users found"
          description={searchTerm ? "No users match your search criteria." : "Get started by adding your first admin user."}
          icon="Users"
          action={!searchTerm ? handleCreateNew : undefined}
          actionLabel="Add Admin User"
        />
      ) : (
        <DataTable
          data={filteredUsers}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default AdminUsers;