import {
  LucideArchive,
  LucideBookOpen,
  LucideClock,
  LucideFlame,
  LucidePlay,
} from "lucide-react-native";
import { useState } from "react";
import { FlatList, View } from "react-native";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { useChangeUserDeck } from "~/modules/user-decks";
import { useGetUserDecks } from "~/modules/user-decks";
import { toast } from "~/components/kit/toast";
import { IGetUserDecksResponse } from "~/interfaces/sdk/user-deck";
import { Link } from "expo-router";
import { withClassName } from "~/lib/with-classname";

withClassName(LucidePlay);
withClassName(LucideArchive);
withClassName(LucideBookOpen);
withClassName(LucideClock);
withClassName(LucideFlame);

const UserDeckCard = ({ deck }: { deck: IGetUserDecksResponse }) => {
  const { mutateAsync } = useChangeUserDeck({
    onSuccess: () => {
      toast.success("Deck movido com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao mover o deck");
    },
  });

  return (
    <Card
      key={deck.id}
      className="bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <CardHeader>
        <View className="flex flex-row justify-between items-center">
          <View className="flex-1">
            <CardTitle className="font-bold text-gray-900">
              <Text className="text-xl" numberOfLines={1}>
                {deck.title}
              </Text>
            </CardTitle>
          </View>
          <Badge variant="secondary" className="ml-2">
            <Text>
              {deck.cardsCount} card{deck.cardsCount > 1 && "s"}
            </Text>
          </Badge>
        </View>
        {deck.enrollment.status === "active" &&
          !deck.enrollment.lastStudyAt && (
            <Text className="text-sm font-semibold color-blue-500">Novo!</Text>
          )}
      </CardHeader>

      <CardContent>
        {deck.enrollment.status === "active" && (
          <>
            {deck.enrollment.lastStudyAt && (
              <View className="flex flex-row gap-4 justify-between items-center mb-4 w-full text-sm text-gray-600">
                <View className="flex flex-row gap-1 items-center">
                  <LucideFlame size={16} className="text-muted-foreground" />
                  <Text>{deck.enrollment.currentStreak} dias</Text>
                </View>

                <View className="flex flex-row gap-1 items-center">
                  <LucideClock size={16} className="text-muted-foreground" />
                  <Text className="text-muted-foreground">
                    {deck.enrollment.lastStudyAt?.toLocaleDateString()}
                  </Text>
                </View>
              </View>
            )}

            <View className="flex flex-row gap-2 w-full">
              <Link href={`/decks/${deck.id}`} asChild>
                <Button className="flex flex-row flex-1 gap-3">
                  <LucidePlay className="w-4 h-4" color="white" />
                  <Text>Estudar</Text>
                </Button>
              </Link>

              <Button
                variant="outline"
                onPress={() =>
                  mutateAsync({
                    id: deck.enrollment.id,
                    status: "archived",
                  })
                }
                className="flex flex-row gap-2 aspect-square"
              >
                <LucideArchive className="w-4 h-4 color-black" />
              </Button>
            </View>
          </>
        )}

        {deck.enrollment.status === "archived" && (
          <Button
            variant="outline"
            onPress={() =>
              mutateAsync({
                id: deck.enrollment.id,
                status: "active",
              })
            }
          >
            <Text>Reativar</Text>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default function HomeScreen() {
  const [tab, setTab] = useState<string>("active");
  const { data: decks } = useGetUserDecks();

  const activeDecks =
    decks?.filter((deck) => deck.enrollment.status === "active") || [];
  const archivedDecks =
    decks?.filter((deck) => deck.enrollment.status === "archived") || [];

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => setTab(value)}
      className="p-4 w-full"
    >
      <TabsList className="flex flex-row mb-6 w-full">
        <TabsTrigger
          value="active"
          className="flex flex-row flex-1 gap-2 items-center"
        >
          <LucidePlay className="w-4 h-4" />
          <Text>Ativos ({activeDecks?.length})</Text>
        </TabsTrigger>
        <TabsTrigger
          value="archived"
          className="flex flex-row flex-1 gap-2 items-center"
        >
          <LucideArchive className="w-4 h-4" />
          <Text>Arquivados ({archivedDecks?.length})</Text>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="active">
        <FlatList
          className="overflow-visible gap-4"
          data={activeDecks}
          ItemSeparatorComponent={() => <View className="h-4" />}
          renderItem={({ item }) => <UserDeckCard key={item.id} deck={item} />}
          ListEmptyComponent={
            <Card className="py-0 text-center">
              <CardContent className="flex flex-col gap-4 justify-center items-center py-8">
                <LucideBookOpen size={48} className="mb-4" color="gray" />
                <Text className="text-xl text-gray-500">Nenhum deck ativo</Text>
                <Link href="/library" asChild>
                  <Button className="w-full">
                    <Text>Procurar decks</Text>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          }
        />
      </TabsContent>

      <TabsContent value="archived">
        <FlatList
          className="gap-4"
          data={archivedDecks}
          ItemSeparatorComponent={() => <View className="h-4" />}
          renderItem={({ item }) => <UserDeckCard key={item.id} deck={item} />}
          ListEmptyComponent={
            <Card className="py-0 text-center">
              <CardContent className="flex flex-col gap-4 justify-center items-center py-8">
                <LucideArchive size={48} className="mb-4" color="gray" />
                <Text className="text-xl text-gray-500">
                  Nenhum deck arquivado
                </Text>
              </CardContent>
            </Card>
          }
        />
      </TabsContent>
    </Tabs>
  );
}
