namespace SimpleSniffBackend.Models
{
    public class AnalyzeRequest
    {
        public IFormFile File { get; set; }
        public string FiltersJson { get; set; }
    }
}