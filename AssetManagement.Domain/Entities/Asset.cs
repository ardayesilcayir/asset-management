using System;
using System.Collections.Generic;
using System.Text;
using AssetManagement.Domain.Enums;

namespace AssetManagement.Domain.Entities
{
    public class Asset : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string SerialNumber { get; set; } = string.Empty;

        public AssetStatus Status { get; set; } = AssetStatus.Available;

        public Guid CategoryId { get; set; }
        public virtual AssetCategory AssetCategory { get; set; } = null!;

        public virtual ICollection<AssetAssignment> AssetAssignments { get; set; }

        public Asset()
        {
            AssetAssignments = new List<AssetAssignment>();
        }

    }
}
