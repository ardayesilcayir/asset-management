using AssetManagement.Application.Interfaces.Repositories;
using AssetManagement.Domain.Entities;
using AssetManagement.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Infrastructure.Repositories
{
    public class AssetCategoryRepository : GenericRepository<AssetCategory>, IAssetCategoryRepository
    {
        public AssetCategoryRepository(AssetDbContext context) : base(context)
        {
        }

        public override async Task<List<AssetCategory>> GetAllAsync(bool includeDeleted = false)
        {
            return await _context.AssetsCategories
                .Include(c => c.Assets)
                .ToListAsync();
        }
    }
}
