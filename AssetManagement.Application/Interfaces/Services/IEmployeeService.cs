using AssetManagement.Application.DTOs.Employee;

namespace AssetManagement.Application.Interfaces.Services
{
    public interface IEmployeeService
    {
        Task<List<EmployeeResponseDto>> GetAllAsync();
        Task<EmployeeResponseDto?> GetByIdAsync(Guid id);
        Task<EmployeeResponseDto> CreateAsync(CreateEmployeeDto dto);
        Task<EmployeeResponseDto?> UpdateAsync(Guid id, UpdateEmployeeDto dto);
        Task<bool> DeleteAsync(Guid id);
    }
}
