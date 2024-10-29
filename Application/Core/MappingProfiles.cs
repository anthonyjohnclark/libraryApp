using AutoMapper;
using Domain;
using Application.Books;

namespace Application.Core;
public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<AddBookDTO, Book>();

        CreateMap<EditBookDTO, Book>();

        CreateMap<Book, BookDetailsDTO>().ForMember(dest => dest.IsAvailable,
               opt => opt.MapFrom(src => !src.BookCheckouts.Any()));

        CreateMap<CustomerReview, CustomerReviewDTO>();

        CreateMap<CustomerReview, CustomerReviewDTO>()
        .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.Customer.DisplayName));

        CreateMap<AddReviewDTO, CustomerReview>();

        CreateMap<Book, FeaturedBookDTO>()
        .ForMember(dest => dest.IsAvailable,
               opt => opt.MapFrom(src => !src.BookCheckouts.Any()));
    }
}
