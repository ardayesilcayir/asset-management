using System;
using System.Collections.Generic;
using System.Text;

namespace AssetManagement.Domain.Entities
{
    public class Employee : BaseEntity
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }

        public Guid DepartmentId { get; set; }

        public virtual Department Department { get; set; } = null!;

        public virtual ICollection<AssetAssignment> AssetAssignments { get; set; }
        public Employee()
        {
            AssetAssignments = new List<AssetAssignment>();
        }
    }
}
