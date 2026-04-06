using AssetManagement.Application.DTOs.Asset;
using AssetManagement.Application.Interfaces.Services;
using AssetManagement.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssetsController : ControllerBase
    {
        private readonly IAssetService _service;
        private readonly IAssetAssignmentService _assignmentService;

        public AssetsController(IAssetService service, IAssetAssignmentService assignmentService)
        {
            _service = service;
            _assignmentService = assignmentService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? search,
            [FromQuery] AssetStatus? status,
            [FromQuery] Guid? categoryId)
        {
            var result = await _service.GetAllAsync(search, status, categoryId);
            return Ok(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null) return NotFound($"ID '{id}' ile varlık bulunamadı.");
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateAssetDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateAssetDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            if (result == null) return NotFound($"ID '{id}' ile varlık bulunamadı.");
            return Ok(result);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var success = await _service.DeleteAsync(id);
                if (!success) return NotFound($"ID '{id}' ile varlık bulunamadı.");
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Bir varlığın tüm zimmet geçmişini döndürür.
        /// </summary>
        [HttpGet("{id:guid}/history")]
        public async Task<IActionResult> GetHistory(Guid id)
        {
            var result = await _assignmentService.GetHistoryByAssetIdAsync(id);
            return Ok(result);
        }
    }
}
