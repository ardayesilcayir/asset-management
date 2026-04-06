using AssetManagement.Application.DTOs.Department;

namespace AssetManagement.Application.Interfaces.Services
{
    public interface IDepartmentService
    {
        Task<List<DepartmentResponseDto>> GetAllAsync();
        Task<DepartmentResponseDto?> GetByIdAsync(Guid id);
        Task<DepartmentResponseDto> CreateAsync(CreateDepartmentDto dto);
        Task<DepartmentResponseDto?> UpdateAsync(Guid id, CreateDepartmentDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
