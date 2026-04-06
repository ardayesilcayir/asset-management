using AssetManagement.Application.Interfaces.Repositories;
using AssetManagement.Domain.Entities;
using AssetManagement.Domain.Enums;
using AssetManagement.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Infrastructure.Repositories
{
    public class AssetRepository : GenericRepository<Asset>, IAssetRepository
    {
        public AssetRepository(AssetDbContext context) : base(context)
        {
        }

        public async Task<List<Asset>> GetAllWithCategoryAsync()
        {
            return await _context.Assets
                .Include(a => a.AssetCategory)
                .ToListAsync();
        }

        public async Task<Asset?> GetWithCategoryAndAssignmentsAsync(Guid id)
        {
            return await _context.Assets
                .Include(a => a.AssetCategory)
                .Include(a => a.AssetAssignments)
                    .ThenInclude(aa => aa.Employee)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<List<Asset>> SearchAsync(string? search, AssetStatus? status, Guid? categoryId)
        {
            var query = _context.Assets
                .Include(a => a.AssetCategory)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(a =>
                    a.Name.Contains(search) ||
                    a.SerialNumber.Contains(search));
            }

            if (status.HasValue)
                query = query.Where(a => a.Status == status.Value);

            if (categoryId.HasValue)
                query = query.Where(a => a.CategoryId == categoryId.Value);

            return await query.ToListAsync();
        }
    }
}
