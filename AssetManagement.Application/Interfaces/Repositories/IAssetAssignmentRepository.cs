using AssetManagement.Domain.Entities;

namespace AssetManagement.Application.Interfaces.Repositories
{
    public interface IAssetAssignmentRepository : IGenericRepository<AssetAssignment>
    {
        Task<AssetAssignment?> GetActiveByAssetIdAsync(Guid assetId);
        Task<List<AssetAssignment>> GetHistoryByAssetIdAsync(Guid assetId);
        Task<List<AssetAssignment>> GetHistoryByEmployeeIdAsync(Guid employeeId);
    }
}
