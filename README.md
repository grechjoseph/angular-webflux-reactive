<h1>Spring Web Flux</h1>

<h2>Running Backend and Frontend</h2>
<ol>
    <li>Backend: Run the Spring project.</li>
    <li>Frontend: <b>cd web-client && npm install && ng serve -o</b></li>
</ol>

<h2>Common Terms</h2>
<b>Mono< Object ></b>: Implement org.reactivestreams.Publisher. Equivalent of Optional< Object > in webflux. May contain 0..1 elements.<br/>
<b>Flux< Object ></b>: Implement org.reactivestreams.Publisher. Equivalent of Collection< Object > in webflux. May contain 0..N elements (possibly infinite). <br/>
<b>Signal</b>: When a Mono or Flux emits an event, this is also referred to as a Signal.<br/>

<h2>Consuming Flux Endpoint using WebClient</h2>

The code below demonstrates how to use Spring WebClient to consume a Reactive endpoint without waiting for the whole response, but rather translate it to a Flux immediately.

``` java
final WebClient webClient = WebClient.create("<url>");
return webClient
        .post()
        .uri("/<path>")
        .body(BodyInserters.fromValue(request))
        .retrieve()
        .bodyToFlux(Page.class)
        // What to log on each signal.
        .log("<log category name>", Level.INFO, SignalType.ON_NEXT);
```

<h2>Consuming Flux Endpoint using ReactiveFeign</h2>

The code below demonstrates how to use Playtika ReactiveFeign to consume a Reactive endpoint without waiting for the whole response, but rather translate it to a Flux immediately.

``` xml
// To enable a WebClient-based Reactive Feign Implementations.
<dependency>
    <groupId>com.playtika.reactivefeign</groupId>
    <artifactId>feign-reactor-webclient</artifactId>
    <version>{reactivefeign.version}</version>
</dependency>

// To Enable Spring Auto Configuration (Eg: @EnableReactiveFeignClients, @ReactiveFeignClient, etc...)
<dependency>
    <groupId>com.playtika.reactivefeign</groupId>
    <artifactId>feign-reactor-spring-configuration</artifactId>
    <version>{reactivefeign.version}</version>
</dependency>
```

``` java
@ReactiveFeignClient(
        name = "<client-name>",
        url = "<client-url>"
)
public interface MyReactiveFeignClient {

    @PostMapping("<path>")
    Flux<Object> myEndPoint(final Object request);

}
```

``` java
@EnableReactiveFeignClients(clients = {
        MyClient.class
})
public class ReactiveFeignConfig {

    ...

}
```

``` java
// <class level: Bean of type MyClient>

final Flux<Object> pageFlux = myClient.myEndPoint(request)
    // What to log on each signal.
    .log("<log category name>", Level.INFO, SignalType.ON_NEXT);
```


<h1>Angular Web Client</h1>
<ol>
    <li>ng new web-client</li>
    <li>cd web-client</li>
    <li>npm install sse.js</li>
    <li>ng generate service service/flux</li>
    <li>ng generate component flux</li>
    <li>ng generate class model/element --type=model</li>
</ol>

<b>app.component.html</b> add < app-flux >< /app-flux > to include flux component.