using AssetManagement.Application.DTOs.AssetCategory;
using AssetManagement.Application.Interfaces.Repositories;
using AssetManagement.Application.Interfaces.Services;
using AssetManagement.Domain.Entities;

namespace AssetManagement.Application.Services
{
    public class AssetCategoryService : IAssetCategoryService
    {
        private readonly IAssetCategoryRepository _repository;

        public AssetCategoryService(IAssetCategoryRepository repository)
        {
            _repository = repository;
        }

        private AssetCategoryResponseDto MapToDto(AssetCategory c) => new()
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description,
            AssetCount = c.Assets?.Count(a => !a.IsDeleted) ?? 0
        };

        public async Task<List<AssetCategoryResponseDto>> GetAllAsync()
        {
            var list = await _repository.GetAllAsync();
            return list.Select(MapToDto).ToList();
        }

        public async Task<AssetCategoryResponseDto?> GetByIdAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            return entity == null ? null : MapToDto(entity);
        }

        public async Task<AssetCategoryResponseDto> CreateAsync(CreateAssetCategoryDto dto)
        {
            var entity = new AssetCategory
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Description = dto.Description
            };
            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();
            return MapToDto(entity);
        }

        public async Task<AssetCategoryResponseDto?> UpdateAsync(Guid id, CreateAssetCategoryDto dto)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return null;
            entity.Name = dto.Name;
            entity.Description = dto.Description;
            entity.UpdateDate = DateTime.Now;
            _repository.Update(entity);
            await _repository.SaveChangesAsync();
            return MapToDto(entity);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return false;
            entity.IsDeleted = true;
            entity.UpdateDate = DateTime.Now;
            _repository.Update(entity);
            await _repository.SaveChangesAsync();
            return true;
        }
    }
}
