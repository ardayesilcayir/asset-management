using AssetManagement.Application.DTOs.AssetAssignment;
using AssetManagement.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssignmentsController : ControllerBase
    {
        private readonly IAssetAssignmentService _service;

        public AssignmentsController(IAssetAssignmentService service)
        {
            _service = service;
        }

        /// <summary>
        /// Tüm aktif zimmetleri listeler (iade edilmemiş).
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetActive()
        {
            var result = await _service.GetActiveAssignmentsAsync();
            return Ok(result);
        }

        /// <summary>
        /// Stoktaki bir varlığı personele zimmetler.
        /// Kural: Sadece Available statüsündeki varlıklar zimmetlenebilir.
        /// </summary>
        [HttpPost("assign")]
        public async Task<IActionResult> Assign([FromBody] AssignAssetDto dto)
        {
            try
            {
                var result = await _service.AssignAssetAsync(dto);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Zimmetli varlığı geri alır. İade durumunu (Available/Broken/Retired) belirtmek zorunludur.
        /// </summary>
        [HttpPost("return")]
        public async Task<IActionResult> Return([FromBody] ReturnAssetDto dto)
        {
            try
            {
                var result = await _service.ReturnAssetAsync(dto);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Belirli bir personelin zimmet geçmişini döndürür.
        /// </summary>
        [HttpGet("employee/{employeeId:guid}")]
        public async Task<IActionResult> GetByEmployee(Guid employeeId)
        {
            var result = await _service.GetHistoryByEmployeeIdAsync(employeeId);
            return Ok(result);
        }
    }
}
