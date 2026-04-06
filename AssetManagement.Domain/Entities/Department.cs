using System;
using System.Collections.Generic;
using System.Text;

namespace AssetManagement.Domain.Entities
{
    public class Department : BaseEntity

    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }

        public virtual ICollection<Employee> Employees { get; set; }

        public Department()
        {
            Employees = new List<Employee>();
        }
    }   

}
