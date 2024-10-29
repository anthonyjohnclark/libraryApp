using Application.Core;
using AutoMapper;

public static class MappingExtensions
{
    public static async Task<PagedList<TDestination>> ToMappedPagedListAsync<TSource, TDestination>(this PagedList<TSource> source, IMapper mapper)
    {
        var items = mapper.Map<List<TDestination>>(source);
        return new PagedList<TDestination>(items, source.TotalCount, source.CurrentPage, source.PageSize);
    }
}
