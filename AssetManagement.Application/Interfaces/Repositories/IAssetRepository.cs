using AssetManagement.Domain.Entities;
using AssetManagement.Domain.Enums;

namespace AssetManagement.Application.Interfaces.Repositories
{
    public interface IAssetRepository : IGenericRepository<Asset>
    {
        Task<List<Asset>> GetAllWithCategoryAsync();
        Task<Asset?> GetWithCategoryAndAssignmentsAsync(Guid id);
        Task<List<Asset>> SearchAsync(string? search, AssetStatus? status, Guid? categoryId);
    }
}
