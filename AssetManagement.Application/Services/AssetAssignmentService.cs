using AssetManagement.Application.DTOs.AssetAssignment;
using AssetManagement.Application.Interfaces.Repositories;
using AssetManagement.Application.Interfaces.Services;
using AssetManagement.Domain.Entities;
using AssetManagement.Domain.Enums;

namespace AssetManagement.Application.Services
{
    public class AssetAssignmentService : IAssetAssignmentService
    {
        private readonly IAssetAssignmentRepository _assignmentRepository;
        private readonly IAssetRepository _assetRepository;

        public AssetAssignmentService(
            IAssetAssignmentRepository assignmentRepository,
            IAssetRepository assetRepository)
        {
            _assignmentRepository = assignmentRepository;
            _assetRepository = assetRepository;
        }

        private AssignmentResponseDto MapToDto(AssetAssignment aa) => new()
        {
            Id = aa.Id,
            AssetId = aa.AssetId,
            AssetName = aa.Asset?.Name ?? string.Empty,
            SerialNumber = aa.Asset?.SerialNumber ?? string.Empty,
            EmployeeId = aa.EmployeeId,
            EmployeeFullName = aa.Employee != null
                ? $"{aa.Employee.FirstName} {aa.Employee.LastName}"
                : string.Empty,
            AssignedDate = aa.AssignedDate,
            ReturnDate = aa.ReturnDate,
            Notes = aa.Notes
        };

        public async Task<AssignmentResponseDto> AssignAssetAsync(AssignAssetDto dto)
        {
            var asset = await _assetRepository.GetByIdAsync(dto.AssetId);
            if (asset == null)
                throw new KeyNotFoundException("Varlık bulunamadı.");

            // İŞ KURALI: Sadece Available statüsündeki varlıklar zimmetlenebilir
            if (asset.Status != AssetStatus.Available)
                throw new InvalidOperationException(
                    $"Bu varlık zimmetlenemez. Mevcut durumu: {asset.Status}. Sadece 'Available' (Stokta) durumundaki varlıklar zimmetlenebilir.");

            var assignment = new AssetAssignment
            {
                Id = Guid.NewGuid(),
                AssetId = dto.AssetId,
                EmployeeId = dto.EmployeeId,
                AssignedDate = DateTime.Now,
                Notes = dto.Notes
            };

            // Varlık durumunu Assigned'a çek
            asset.Status = AssetStatus.Assigned;
            asset.UpdateDate = DateTime.Now;
            _assetRepository.Update(asset);

            await _assignmentRepository.AddAsync(assignment);
            await _assignmentRepository.SaveChangesAsync();

            // Tam response için tekrar çek
            var created = await _assignmentRepository.GetActiveByAssetIdAsync(dto.AssetId);
            return MapToDto(created ?? assignment);
        }

        public async Task<AssignmentResponseDto> ReturnAssetAsync(ReturnAssetDto dto)
        {
            var assignment = await _assignmentRepository.GetByIdAsync(dto.AssignmentId);
            if (assignment == null)
                throw new KeyNotFoundException("Zimmet kaydı bulunamadı.");

            if (assignment.ReturnDate != null)
                throw new InvalidOperationException("Bu zimmet kaydı zaten iade alınmış.");

            // Sadece Available, Broken veya Retired kabul edilir
            if (dto.ReturnStatus == AssetStatus.Assigned)
                throw new InvalidOperationException("İade durumu 'Assigned' olamaz. Lütfen Available, Broken veya Retired seçin.");

            assignment.ReturnDate = DateTime.Now;
            assignment.Notes = dto.Notes ?? assignment.Notes;
            _assignmentRepository.Update(assignment);

            // Varlık durumunu güncelle
            var asset = await _assetRepository.GetByIdAsync(assignment.AssetId);
            if (asset != null)
            {
                asset.Status = dto.ReturnStatus;
                asset.UpdateDate = DateTime.Now;
                _assetRepository.Update(asset);
            }

            await _assignmentRepository.SaveChangesAsync();
            return MapToDto(assignment);
        }

        public async Task<List<AssignmentResponseDto>> GetActiveAssignmentsAsync()
        {
            var all = await _assignmentRepository.FindAsync(a => a.ReturnDate == null);
            return all.Select(MapToDto).ToList();
        }

        public async Task<List<AssignmentResponseDto>> GetHistoryByAssetIdAsync(Guid assetId)
        {
            var list = await _assignmentRepository.GetHistoryByAssetIdAsync(assetId);
            return list.Select(MapToDto).ToList();
        }

        public async Task<List<AssignmentResponseDto>> GetHistoryByEmployeeIdAsync(Guid employeeId)
        {
            var list = await _assignmentRepository.GetHistoryByEmployeeIdAsync(employeeId);
            return list.Select(MapToDto).ToList();
        }
    }
}
