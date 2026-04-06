using AssetManagement.Application.Interfaces.Repositories;
using AssetManagement.Domain.Entities;
using AssetManagement.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Infrastructure.Repositories
{
    public class EmployeeRepository : GenericRepository<Employee>, IEmployeeRepository
    {
        public EmployeeRepository(AssetDbContext context) : base(context)
        {
        }

        public async Task<Employee?> GetWithAssignmentsAsync(Guid id)
        {
            return await _context.Employees
                .Include(e => e.Department)
                .Include(e => e.AssetAssignments)
                    .ThenInclude(a => a.Asset)
                .FirstOrDefaultAsync(e => e.Id == id);
        }
    }
}
