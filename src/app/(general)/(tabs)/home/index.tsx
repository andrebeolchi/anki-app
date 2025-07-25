import {
  LucideArchive,
  LucideBookOpen,
  LucideClock,
  LucideFlame,
  LucideGlasses,
  LucidePlay,
} from "lucide-react-native";
import { useState } from "react";
import { FlatList, View } from "react-native";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { useChangeUserDeck } from "~/modules/user-decks";
import { useGetUserDecks } from "~/modules/user-decks";
import { toast } from "~/components/kit/toast";
import { IGetUserDecksResponse } from "~/interfaces/sdk/user-deck";
import { Link } from "expo-router";
import { withClassName } from "~/lib/with-classname";
import dayjs from "dayjs";

withClassName([
  LucidePlay,
  LucideArchive,
  LucideBookOpen,
  LucideClock,
  LucideFlame,
  LucideGlasses,
  LucideBookOpen,
  LucideArchive,
])

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
      className="transition-shadow bg-white shadow-sm hover:shadow-md"
    >
      <CardHeader>
        <View className="flex flex-row items-center justify-between">
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

      {deck.enrollment.status === "active" && (
        <>
          {deck.enrollment.lastStudyAt && (
            <CardContent>
              <View className="flex flex-row items-center justify-between w-full text-sm text-muted-foreground">
                <Text className="text-muted-foreground">
                  Estudado {dayjs().to(deck.enrollment.lastStudyAt)}
                </Text>

                <View className="flex flex-row items-center gap-1">
                  <LucideFlame size={16} className="text-muted-foreground" />
                  <Text>{deck.enrollment.currentStreak} dia{(deck.enrollment.currentStreak || 0) > 1 && 's'}</Text>
                </View>
              </View>
            </CardContent>
          )}

          <CardFooter>
            <View className="flex flex-row w-full gap-2">
              <Link href={`/decks/${deck.id}`} asChild>
                <Button className="flex flex-row flex-1 gap-3">
                  <LucideGlasses size={20} className="color-white" />
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
                <LucideArchive size={20} className="color-black" />
              </Button>
            </View>
          </CardFooter>
        </>
      )}

      {deck.enrollment.status === "archived" && (
        <CardContent>
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
        </CardContent>
      )}
    </Card>
  );
};

export default function HomeScreen() {
  const [tab, setTab] = useState<string>("active");
  const { data: decks } = useGetUserDecks();

  const activeDecks = decks?.filter((deck) => deck.enrollment.status === "active") || [];
  const archivedDecks = decks?.filter((deck) => deck.enrollment.status === "archived") || [];

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => setTab(value)}
      className="w-full p-6"
    >
      <TabsList className="flex flex-row w-full mb-6">
        <TabsTrigger
          value="active"
          className="flex flex-row items-center flex-1 gap-2"
        >
          <LucidePlay size={16} />
          <Text>Ativos ({activeDecks?.length})</Text>
        </TabsTrigger>
        <TabsTrigger
          value="archived"
          className="flex flex-row items-center flex-1 gap-2"
        >
          <LucideArchive size={16} />
          <Text>Arquivados ({archivedDecks?.length})</Text>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="active">
        <FlatList
          data={activeDecks}
          contentContainerClassName="gap-6"
          renderItem={({ item }) => <UserDeckCard key={item.id} deck={item} />}
          ListEmptyComponent={
            <Card className="py-0 text-center">
              <CardContent className="flex flex-col items-center justify-center gap-3 py-8">
                <LucideBookOpen size={48} className="color-muted-foreground" />
                <Text className="text-xl text-muted-foreground">Nenhum deck ativo</Text>
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
          data={archivedDecks}
          contentContainerClassName="gap-6"
          renderItem={({ item }) => <UserDeckCard key={item.id} deck={item} />}
          ListEmptyComponent={
            <Card className="py-0 text-center">
              <CardContent className="flex flex-col items-center justify-center gap-3 py-8">
                <LucideArchive size={48} className="color-muted-foreground" />
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
