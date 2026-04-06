using AssetManagement.Domain.Entities;

namespace AssetManagement.Application.Interfaces.Repositories
{
    public interface IEmployeeRepository : IGenericRepository<Employee>
    {
        Task<Employee?> GetWithAssignmentsAsync(Guid id);
    }
}
