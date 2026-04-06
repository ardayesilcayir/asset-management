using AssetManagement.Application.DTOs.Employee;
using AssetManagement.Application.Interfaces.Repositories;
using AssetManagement.Application.Interfaces.Services;
using AssetManagement.Domain.Entities;

namespace AssetManagement.Application.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;

        public EmployeeService(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

        private EmployeeResponseDto MapToDto(Employee e) => new()
        {
            Id = e.Id,
            FirstName = e.FirstName,
            LastName = e.LastName,
            Email = e.Email,
            Phone = e.Phone,
            DepartmentId = e.DepartmentId,
            DepartmentName = e.Department?.Name ?? string.Empty,
            ActiveAssignmentCount = e.AssetAssignments?.Count(a => a.ReturnDate == null) ?? 0
        };

        public async Task<List<EmployeeResponseDto>> GetAllAsync()
        {
            var employees = await _employeeRepository.GetAllAsync();
            return employees.Select(MapToDto).ToList();
        }

        public async Task<EmployeeResponseDto?> GetByIdAsync(Guid id)
        {
            var e = await _employeeRepository.GetWithAssignmentsAsync(id);
            return e == null ? null : MapToDto(e);
        }

        public async Task<EmployeeResponseDto> CreateAsync(CreateEmployeeDto dto)
        {
            var entity = new Employee
            {
                Id = Guid.NewGuid(),
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Phone = dto.Phone,
                DepartmentId = dto.DepartmentId
            };
            await _employeeRepository.AddAsync(entity);
            await _employeeRepository.SaveChangesAsync();
            return MapToDto(entity);
        }

        public async Task<EmployeeResponseDto?> UpdateAsync(Guid id, UpdateEmployeeDto dto)
        {
            var entity = await _employeeRepository.GetByIdAsync(id);
            if (entity == null) return null;
            entity.FirstName = dto.FirstName;
            entity.LastName = dto.LastName;
            entity.Email = dto.Email;
            entity.Phone = dto.Phone;
            entity.DepartmentId = dto.DepartmentId;
            entity.UpdateDate = DateTime.Now;
            _employeeRepository.Update(entity);
            await _employeeRepository.SaveChangesAsync();
            return MapToDto(entity);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _employeeRepository.GetByIdAsync(id);
            if (entity == null) return false;
            entity.IsDeleted = true;
            entity.UpdateDate = DateTime.Now;
            _employeeRepository.Update(entity);
            await _employeeRepository.SaveChangesAsync();
            return true;
        }
    }
}
