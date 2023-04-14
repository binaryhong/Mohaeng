package com.mohaeng.backend.place.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.mohaeng.backend.place.domain.Review;
import com.mohaeng.backend.place.domain.ReviewImage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Builder
public class FindAllReviewResponse {

    private Long reviewId;
    private String nickname;
    private String memberImage;
    private String rating;
    private String content;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime createdDate;
    private List<String> imgUrl;


    @Builder
    public static FindAllReviewResponse of(Review review) {
        return new FindAllReviewResponse(
                review.getId(),
                review.getMember().getNickName(),
                review.getMember().getImageURL() + "/" + review.getMember().getImageName(),
                review.getRating(),
                review.getContent(),
                review.getCreatedDate(),
        getAllImageName(review));
    }

    private static List<String> getAllImageName(Review review) {
        List<ReviewImage> list = review.getReviewImageList();
        List<String> imgUrl = new ArrayList<>();
        for (ReviewImage reviewImage : list) {
            imgUrl.add(reviewImage.getImageUrl() + "/" + reviewImage.getImageName());
        }
        return imgUrl;
    }
}
