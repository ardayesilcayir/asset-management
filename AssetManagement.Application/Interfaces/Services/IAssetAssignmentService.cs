using AssetManagement.Application.DTOs.AssetAssignment;

namespace AssetManagement.Application.Interfaces.Services
{
    public interface IAssetAssignmentService
    {
        Task<AssignmentResponseDto> AssignAssetAsync(AssignAssetDto dto);
        Task<AssignmentResponseDto> ReturnAssetAsync(ReturnAssetDto dto);
        Task<List<AssignmentResponseDto>> GetHistoryByAssetIdAsync(Guid assetId);
        Task<List<AssignmentResponseDto>> GetHistoryByEmployeeIdAsync(Guid employeeId);
        Task<List<AssignmentResponseDto>> GetActiveAssignmentsAsync();
    }
}
