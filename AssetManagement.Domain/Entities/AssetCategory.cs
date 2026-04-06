using System;
using System.Collections.Generic;
using System.Text;

namespace AssetManagement.Domain.Entities
{
    public class AssetCategory : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set;}

        public virtual ICollection<Asset> Assets { get; set; }

        public AssetCategory()
        {
            Assets = new List<Asset>();
        }
    }
}
