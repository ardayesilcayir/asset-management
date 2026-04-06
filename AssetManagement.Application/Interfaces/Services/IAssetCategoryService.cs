using AssetManagement.Application.DTOs.AssetCategory;

namespace AssetManagement.Application.Interfaces.Services
{
    public interface IAssetCategoryService
    {
        Task<List<AssetCategoryResponseDto>> GetAllAsync();
        Task<AssetCategoryResponseDto?> GetByIdAsync(Guid id);
        Task<AssetCategoryResponseDto> CreateAsync(CreateAssetCategoryDto dto);
        Task<AssetCategoryResponseDto?> UpdateAsync(Guid id, CreateAssetCategoryDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
