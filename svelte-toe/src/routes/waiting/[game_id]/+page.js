export function load({ params }) {
    console.log('load params:', params);
    return {
        game_id: params.game_id
    };
}
