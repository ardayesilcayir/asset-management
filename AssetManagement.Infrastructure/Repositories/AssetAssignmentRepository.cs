using AssetManagement.Application.Interfaces.Repositories;
using AssetManagement.Domain.Entities;
using AssetManagement.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Infrastructure.Repositories
{
    public class AssetAssignmentRepository : GenericRepository<AssetAssignment>, IAssetAssignmentRepository
    {
        public AssetAssignmentRepository(AssetDbContext context) : base(context)
        {
        }

        public async Task<AssetAssignment?> GetActiveByAssetIdAsync(Guid assetId)
        {
            return await _context.AssetAssignments
                .Include(aa => aa.Employee)
                .Include(aa => aa.Asset)
                .FirstOrDefaultAsync(aa => aa.AssetId == assetId && aa.ReturnDate == null);
        }

        public async Task<List<AssetAssignment>> GetHistoryByAssetIdAsync(Guid assetId)
        {
            return await _context.AssetAssignments
                .Include(aa => aa.Employee)
                    .ThenInclude(e => e.Department)
                .Include(aa => aa.Asset)
                .Where(aa => aa.AssetId == assetId)
                .OrderByDescending(aa => aa.AssignedDate)
                .ToListAsync();
        }

        public async Task<List<AssetAssignment>> GetHistoryByEmployeeIdAsync(Guid employeeId)
        {
            return await _context.AssetAssignments
                .Include(aa => aa.Asset)
                    .ThenInclude(a => a.AssetCategory)
                .Include(aa => aa.Employee)
                .Where(aa => aa.EmployeeId == employeeId)
                .OrderByDescending(aa => aa.AssignedDate)
                .ToListAsync();
        }
    }
}
