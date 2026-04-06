using AssetManagement.Application.DTOs.AssetCategory;
using AssetManagement.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssetCategoriesController : ControllerBase
    {
        private readonly IAssetCategoryService _service;

        public AssetCategoriesController(IAssetCategoryService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null) return NotFound($"ID '{id}' ile kategori bulunamadı.");
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateAssetCategoryDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] CreateAssetCategoryDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            if (result == null) return NotFound($"ID '{id}' ile kategori bulunamadı.");
            return Ok(result);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var success = await _service.DeleteAsync(id);
            if (!success) return NotFound($"ID '{id}' ile kategori bulunamadı.");
            return NoContent();
        }
    }
}
