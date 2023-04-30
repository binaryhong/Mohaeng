package com.mohaeng.backend.place.initializer;

import com.mohaeng.backend.place.domain.Place;
import com.mohaeng.backend.place.repository.PlaceRepository;
import com.mohaeng.backend.place.service.PlaceService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Profile("prod")
@RequiredArgsConstructor
@Component
@Slf4j
public class PlaceInitializer {

    private final PlaceRepository placeRepository;
    private final PlaceService placeService;

    @PostConstruct
    @Scheduled(cron = "0 0 0 * * ?")
    public void init() throws IOException {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();
        placeService.saveInitImage();
        List<Place> places = Optional.of(placeRepository.findAll())
                .filter(List::isEmpty)
                .map(list -> getPlacesOrThrow())
                .orElseGet(placeRepository::findAll);
        placeRepository.saveAll(places);

        Map<String, Place> oldPlacesMap = places.stream()
                .collect(Collectors.toMap(Place::getContentId, Function.identity()));
        List<Place> newPlaces = getPlacesOrThrow();
        newPlaces.forEach(newPlace -> {
            Optional.ofNullable(oldPlacesMap.get(newPlace.getContentId()))
                    .filter(oldPlace -> !newPlace.equals(oldPlace))
                    .ifPresent(oldPlace -> {
                        oldPlace.update(newPlace);
                        placeRepository.save(oldPlace);
                    });
        });

        stopWatch.stop();
        long totalTimeMillis = stopWatch.getTotalTimeMillis();
        System.out.println("total time : " + totalTimeMillis);
        placeRepository.flush();
    }

    private List<Place> getPlacesOrThrow() {
        try {
            return placeService.getPlaces();
        } catch (IOException | ParserConfigurationException | SAXException e) {
            throw new RuntimeException(e);
        }
    }
}
