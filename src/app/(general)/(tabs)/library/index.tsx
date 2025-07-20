import { Link } from "expo-router";
import { LucidePlus } from "lucide-react-native";
import { FlatList, Pressable, View } from "react-native";
import { toast } from "~/components/kit/toast";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { IGetDecksResponse } from "~/interfaces/sdk/deck";
import { withClassName } from "~/lib/with-classname";
import { useGetAuthUser } from "~/modules/auth";
import { useGetDecks } from "~/modules/deck";
import { useCreateUserDeck } from "~/modules/user-decks";

withClassName(LucidePlus);

const DeckCard = ({ deck }: { deck: IGetDecksResponse }) => {
  const { data: user } = useGetAuthUser();

  const { mutateAsync } = useCreateUserDeck({
    onSuccess: () => {
      toast.success("Baralho adicionado aos estudos!");
    },
    onError: () => {
      toast.error("Erro ao adicionar o baralho aos estudos");
    },
  });

  return (
    <Card key={deck.id}>
      <CardHeader className="w-full">
        <View className="gap-3">
          <View className="flex flex-row items-start justify-between">
            <CardTitle>{deck.title}</CardTitle>
            <Badge variant="secondary">
              <Text>{deck.cardsCount} cards</Text>
            </Badge>
          </View>
          <CardDescription numberOfLines={4}>
            {deck.description}
          </CardDescription>
          <View className="flex flex-row justify-between gap-1">
            {deck.creator.id === user?.id && <Text>Feito por você</Text>}
            {deck.creator.id !== user?.id && (
              <Text>Criado por {deck.creator.name}</Text>
            )}
            <View className="flex flex-row items-center gap-1">
              <Text className="font-semibold">
                {deck.status === "public" ? "Publico" : "Privado"}
              </Text>
            </View>
          </View>
        </View>
      </CardHeader>

      <CardContent>
        {deck.enrolled && (
          <View className="items-center w-full p-3 border rounded-lg border-lime-600">
            <Text className="font-semibold text-lime-600">Na sua coleção</Text>
          </View>
        )}

        {!deck.enrolled && (
          <Button
            variant="outline"
            className="flex-row items-center gap-3"
            onPress={() =>
              mutateAsync({ deckId: deck.id, userId: user?.id || "" })
            }
          >
            <LucidePlus size={16} />
            <Text className="text-card-foreground">Adicionar aos estudos</Text>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default function LibraryScreen() {
  const { data: decks } = useGetDecks();

  const orderDecks = (deckList: typeof decks) =>
    deckList?.sort((a, b) => {
      if (a.enrolled && !b.enrolled) return 1;
      if (!a.enrolled && b.enrolled) return -1;
      return 0;
    });

  return (
    <View className="flex-1 gap-6 p-6">
      <FlatList
        data={orderDecks(decks)}
        renderItem={({ item }) => <DeckCard deck={item} />}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View className="h-4" />}
      />

      <Link href="/decks/create" asChild>
        <Pressable className="absolute p-6 rounded-full right-6 bottom-6 bg-primary">
          <LucidePlus size={24} className="text-primary-foreground" />
        </Pressable>
      </Link>
    </View>
  );
}
