using AssetManagement.Application.DTOs.Asset;
using AssetManagement.Domain.Enums;

namespace AssetManagement.Application.Interfaces.Services
{
    public interface IAssetService
    {
        Task<List<AssetResponseDto>> GetAllAsync(string? search = null, AssetStatus? status = null, Guid? categoryId = null);
        Task<AssetResponseDto?> GetByIdAsync(Guid id);
        Task<AssetResponseDto> CreateAsync(CreateAssetDto dto);
        Task<AssetResponseDto?> UpdateAsync(Guid id, UpdateAssetDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
