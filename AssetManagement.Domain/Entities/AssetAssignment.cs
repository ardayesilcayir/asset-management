using System;
using System.Collections.Generic;
using System.Text;

namespace AssetManagement.Domain.Entities
{
    public class AssetAssignment : BaseEntity
    {
        public Guid EmployeeId { get; set;}
        public virtual Employee Employee { get; set; } = null!;
        public Guid AssetId { get; set; }
        public virtual Asset Asset { get; set; } = null!;
        public DateTime AssignedDate { get; set; } = DateTime.Now;

        public DateTime? ReturnDate { get; set; }

        public string? Notes { get; set; }
    }
}
