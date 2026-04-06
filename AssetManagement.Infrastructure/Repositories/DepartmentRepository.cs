using AssetManagement.Application.Interfaces.Repositories;
using AssetManagement.Domain.Entities;
using AssetManagement.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Infrastructure.Repositories
{
    public class DepartmentRepository : GenericRepository<Department>, IDepartmentRepository
    {
        public DepartmentRepository(AssetDbContext context) : base(context)
        {
        }

        public override async Task<List<Department>> GetAllAsync(bool includeDeleted = false)
        {
            return await _context.Departments
                .Include(d => d.Employees)
                .ToListAsync();
        }
    }
}
