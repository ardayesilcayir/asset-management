namespace AssetManagement.Application.DTOs.AssetAssignment
{
    public class AssignmentResponseDto
    {
        public Guid Id { get; set; }
        public Guid AssetId { get; set; }
        public string AssetName { get; set; } = string.Empty;
        public string SerialNumber { get; set; } = string.Empty;
        public Guid EmployeeId { get; set; }
        public string EmployeeFullName { get; set; } = string.Empty;
        public DateTime AssignedDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public string? Notes { get; set; }
        public bool IsActive => ReturnDate == null;
    }
}
