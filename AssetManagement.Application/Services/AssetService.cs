using AssetManagement.Application.DTOs.Asset;
using AssetManagement.Application.Interfaces.Repositories;
using AssetManagement.Application.Interfaces.Services;
using AssetManagement.Domain.Entities;
using AssetManagement.Domain.Enums;

namespace AssetManagement.Application.Services
{
    public class AssetService : IAssetService
    {
        private readonly IAssetRepository _repository;

        public AssetService(IAssetRepository repository)
        {
            _repository = repository;
        }

        private AssetResponseDto MapToDto(Asset a) => new()
        {
            Id = a.Id,
            Name = a.Name,
            SerialNumber = a.SerialNumber,
            Status = a.Status,
            CategoryId = a.CategoryId,
            CategoryName = a.AssetCategory?.Name ?? string.Empty,
            CreateDate = a.CreateDate
        };

        public async Task<List<AssetResponseDto>> GetAllAsync(string? search = null, AssetStatus? status = null, Guid? categoryId = null)
        {
            var assets = await _repository.SearchAsync(search, status, categoryId);
            return assets.Select(MapToDto).ToList();
        }

        public async Task<AssetResponseDto?> GetByIdAsync(Guid id)
        {
            var asset = await _repository.GetWithCategoryAndAssignmentsAsync(id);
            return asset == null ? null : MapToDto(asset);
        }

        public async Task<AssetResponseDto> CreateAsync(CreateAssetDto dto)
        {
            var entity = new Asset
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                SerialNumber = dto.SerialNumber,
                CategoryId = dto.CategoryId,
                Status = AssetStatus.Available
            };
            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();
            return MapToDto(entity);
        }

        public async Task<AssetResponseDto?> UpdateAsync(Guid id, UpdateAssetDto dto)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return null;
            entity.Name = dto.Name;
            entity.SerialNumber = dto.SerialNumber;
            entity.CategoryId = dto.CategoryId;
            entity.UpdateDate = DateTime.Now;
            _repository.Update(entity);
            await _repository.SaveChangesAsync();
            return MapToDto(entity);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return false;

            // Zimmetli varlık silinemez
            if (entity.Status == AssetStatus.Assigned)
                throw new InvalidOperationException("Zimmetli bir varlık silinemez. Önce iade alınmalıdır.");

            entity.IsDeleted = true;
            entity.UpdateDate = DateTime.Now;
            _repository.Update(entity);
            await _repository.SaveChangesAsync();
            return true;
        }
    }
}
