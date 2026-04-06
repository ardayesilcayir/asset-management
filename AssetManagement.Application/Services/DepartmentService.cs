using AssetManagement.Application.DTOs.Department;
using AssetManagement.Application.Interfaces.Repositories;
using AssetManagement.Application.Interfaces.Services;
using AssetManagement.Domain.Entities;

namespace AssetManagement.Application.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly IDepartmentRepository _departmentRepository;

        public DepartmentService(IDepartmentRepository departmentRepository)
        {
            _departmentRepository = departmentRepository;
        }

        public async Task<List<DepartmentResponseDto>> GetAllAsync()
        {
            var departments = await _departmentRepository.GetAllAsync();
            return departments.Select(d => new DepartmentResponseDto
            {
                Id = d.Id,
                Name = d.Name,
                Description = d.Description,
                EmployeeCount = d.Employees?.Count(e => !e.IsDeleted) ?? 0
            }).ToList();
        }

        public async Task<DepartmentResponseDto?> GetByIdAsync(Guid id)
        {
            var d = await _departmentRepository.GetByIdAsync(id);
            if (d == null) return null;
            return new DepartmentResponseDto
            {
                Id = d.Id,
                Name = d.Name,
                Description = d.Description,
                EmployeeCount = d.Employees?.Count(e => !e.IsDeleted) ?? 0
            };
        }

        public async Task<DepartmentResponseDto> CreateAsync(CreateDepartmentDto dto)
        {
            var entity = new Department
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Description = dto.Description
            };
            await _departmentRepository.AddAsync(entity);
            await _departmentRepository.SaveChangesAsync();
            return new DepartmentResponseDto { Id = entity.Id, Name = entity.Name, Description = entity.Description };
        }

        public async Task<DepartmentResponseDto?> UpdateAsync(Guid id, CreateDepartmentDto dto)
        {
            var entity = await _departmentRepository.GetByIdAsync(id);
            if (entity == null) return null;
            entity.Name = dto.Name;
            entity.Description = dto.Description;
            entity.UpdateDate = DateTime.Now;
            _departmentRepository.Update(entity);
            await _departmentRepository.SaveChangesAsync();
            return new DepartmentResponseDto { Id = entity.Id, Name = entity.Name, Description = entity.Description };
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _departmentRepository.GetByIdAsync(id);
            if (entity == null) return false;
            entity.IsDeleted = true;
            entity.UpdateDate = DateTime.Now;
            _departmentRepository.Update(entity);
            await _departmentRepository.SaveChangesAsync();
            return true;
        }
    }
}
