namespace AssetManagement.Application.DTOs.AssetAssignment
{
    public class AssignAssetDto
    {
        public Guid AssetId { get; set; }
        public Guid EmployeeId { get; set; }
        public string? Notes { get; set; }
    }
}
